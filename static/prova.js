import Complex from '../v2/js/complex.js';
import { writeFile } from 'fs/promises';
import { stdout } from 'process'


const LIFE = 4;
const PARTICLES = 15;
const TAU = 3;


class ProgressBar {
    constructor() {
        this.cursor = 0;
    }
    start() {
        stdout.write("\x1B[?25l");
        stdout.write('['+'\u2591'.repeat(100)+'] 0%');
        this.cursor = 0;
        return this;
    }
    tick() {
        this.cursor++;
        stdout.cursorTo(this.cursor);
        stdout.write('\u2588');
        stdout.cursorTo(103);
        stdout.write(this.cursor+'%');
    }
    stop() {
        stdout.write("\x1B[?25h\n");
    }
}


/**
 * @typedef {{
 * (value: number) => number, 
 * domain: (min: number, max: number) => linearScale,
 * range: (min: number, max: number) => linearScale
 * }} linearScale
 */
/**
 * Constructs a new linear scale
 * @returns {linearScale}
 */
function linearScale() {
    var from_min = 0;
    var from_dim = 1;
    var to_min = 0;
    var to_dim = 1;
    const compute = v => (v-from_min)/from_dim*to_dim + to_min;
    compute.domain = (min, max) => {
        from_min = min;
        from_dim = max-min;
        return compute;
    }
    compute.range = (min, max) => {
        to_min = min;
        to_dim = max-min;
        return compute;
    }
    return compute;
}

const xScale = linearScale().domain(-3, 3).range(0, 300);
const yScale = linearScale().domain(-2, 2).range(200, 0);
const rand = (min, max) => Math.random()*(max-min)+min;

/**
 * @param {Complex} x 
 * @param {Complex} y 
 */
function f(x, y) {
    y.eq(x).mul(x).exponentiate();
}

function toPathPiece(c) {
    return 'L'+xScale(c.real)+','+yScale(c.imag);
}

function particle() {
    const frames = LIFE*60;
    const x = new Complex(rand(-3,3), rand(-2,2));
    const y = new Complex();
    var speed;
    var factor;
    var path = 'M'+xScale(x.real)+','+yScale(x.imag);
    var colors = "#fff";
    for(var i=0; i<frames; i++) {
        f(x, y);
        speed = Math.sqrt(y.real*y.real + x.imag*x.imag);
        factor = Math.expm1(-speed/TAU) // [-1,0]
        y.normalize().mul_r(-0.01*factor);
        x.add(y);
        path += toPathPiece(x);
        colors += ";hsl("+240*(1+factor)+",55%,55%)";
    }
    const delay = Math.random()*LIFE;
    return `<circle r=".75">
    <animateMotion begin="${delay}s" dur="${LIFE}s" repeatCount="indefinite" fill="freeze" path="${path}" />
    <animate attributeName="fill" values="${colors}" begin="${delay}" dur="${LIFE}" repeatCount="indefinite" />
</circle>\n`;
}

let svg = '<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">\n';

const pb = new ProgressBar().start();
for(var i=0; i<100; i++) {
    for(var j=0; j<PARTICLES; j++) svg += particle();
    pb.tick();
}
pb.stop();

let xAxisY = yScale(0);
svg += '<line x1="0" x2="300" y1="'+xAxisY+'" y2="'+xAxisY+'" stroke="#ccc" stroke-width="0.25" />\n'
let yAxisX = xScale(0);
svg += '<line y1="0" y2="200" x1="'+yAxisX+'" x2="'+yAxisX+'" stroke="#ccc" stroke-width="0.25" />\n';
svg += '</svg>';


writeFile('./prova.svg',svg)
.then(() => console.log("Done"))
.catch(err => console.log(err));
