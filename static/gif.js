import Complex from '../v2/js/complex.js';
import { linearScale } from './linear.js';
import { writeFile } from 'fs/promises';
import progress from './progress.js';
import { createCanvas } from 'canvas';
import gifEncoder2 from 'gif-encoder-2';


const FRAMES = 120;
const PARTICLES = 8000;
const TAU = 3;

/**
 * @param {Complex} x 
 * @param {Complex} y 
 */
 function f(x, y) {
    y.eq(x).mul(x).exponentiate();
}

const gif = new gifEncoder2(600, 400, "neuquant", false, FRAMES);
gif.setFrameRate(60);
gif.setRepeat(0);

const rand = (min, max) => Math.random()*(max-min)+min;
const dz = new Complex();
/**@type {Complex[]} */
const z = new Array(PARTICLES);
for(var i=0; i<PARTICLES; i++) z[i] = new Complex(rand(-3,3), rand(-2,2));

const xScale = linearScale().domain(-3,3).range(0,600);
const yScale = linearScale().domain(-2,2).range(400,0);
const ctx = createCanvas(600, 400).getContext('2d');
ctx.fillStyle = "#111";
ctx.fillRect(0,0,600,400);

function frame() {
    ctx.fillStyle = "#1115";
    ctx.fillRect(0,0,600,400);
    let speed;
    let factor;
    for(var i=0; i<PARTICLES; i++) {
        f(z[i], dz);
        speed = Math.sqrt(dz.real*dz.real + dz.imag*dz.imag);
        factor = Math.expm1(-speed/TAU) // [-1,0]
        dz.normalize().mul_r(-0.01*factor);
        z[i].add(y);

        ctx.fillStyle = "hsl("+240*(1+factor)+",55%,55%)";
        ctx.fillRect(xScale(z[i].real), yScale(z[i].imag), 1, 1);
        gif.addFrame(ctx);
    }
}

gif.start();
progress(FRAMES, frame);
gif.finish();
writeFile('./prova.gif', gif.out.getData())
.then(() => console.log("Done"))
.catch(err => console.log(err));
