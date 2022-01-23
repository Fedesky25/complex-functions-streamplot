const Complex = require('./Complex.js');
const { linearScale } = require('./linear.js');
const { writeFile } = require('fs/promises');
const { progress, msStamp } = require("./progress");
const { createCanvas } = require("canvas");
const createConcurrentEncoder = require("./ConcurrentEncoder");


const FRAMES = 180;
const PARTICLES = 20000;
const TAU = 3;
const CLR_NUM = 8;

const WIDTH = 1920; // 3440
const HEIGHT = 1080; // 1440


const a = new Complex(0,-1);
/**
 * @param {Complex} x 
 * @param {Complex} y 
 */
 function f(x, y) {
    y.eq(x).mul(x).add(a);
}


const rand = (min, max) => Math.random()*(max-min)+min;
const xScale = linearScale().domain(-3,3).range(0,WIDTH);
const yScale = linearScale().domain(-2,2).range(HEIGHT,0);

/**@returns {Any[][][]} */
function newFrames() {
    let i;
    let j;
    const res = new Array(FRAMES);
    for(i=0; i<FRAMES; i++) {
        res[i] = new Array(CLR_NUM);
        for(j=0; j<CLR_NUM; j++) res[i][j] = [];
    }
    return res;
}

let start;
const frames = newFrames();

const x = new Complex();
const y = new Complex();
function particle() {
    let i;
    let factor;
    const bias = Math.floor(Math.random()*FRAMES);
    x.becomes(rand(-3,3), rand(-2,2));
    for(i=bias; i<FRAMES; i++) {
        f(x,y);
        factor = -Math.expm1(-Math.sqrt(y.real*y.real+y.imag*y.imag)/TAU);
        y.normalize().mul_r(0.01*factor);
        x.add(y);
        frames[i][Math.floor(factor*CLR_NUM-0.01)].push(xScale(x.real), yScale(x.imag));
    }
    for(i=0; i<bias; i++) {
        f(x,y);
        factor = -Math.expm1(-Math.sqrt(y.real*y.real+y.imag*y.imag)/TAU);
        y.normalize().mul_r(0.01*factor);
        x.add(y);
        frames[i][Math.floor(factor*CLR_NUM-0.01)].push(xScale(x.real), yScale(x.imag));
    }
}

progress("Particle motion calculation", PARTICLES, particle);

// const dz = new Complex();
// /**@type {Complex[]} */
// const z = new Array(PARTICLES);
// for(var i=0; i<PARTICLES; i++) z[i] = new Complex(rand(-3,3), rand(-2,2));
// function frame(fi) {
//     let factor;
//     for(var i=0; i<PARTICLES; i++) {
//         f(z[i],dz);
//         factor = -Math.expm1(-Math.sqrt(dz.real*dz.real+dz.imag*dz.imag)/TAU);
//         dz.normalize().mul_r(0.01*factor);
//         z[i].add(dz);
//         frames[fi][Math.floor(factor*CLR_NUM-0.01)].push(xScale(z[i].real), yScale(z[i].imag));
//     }
// }

// console.log("Frames calculation:");
// start = performance.now();
// progress(FRAMES, frame);
// console.log("Time elapsed: "+(performance.now()-start).toPrecision(3)+" ms");

// const gif = new GIFEncoder(WIDTH, HEIGHT, "neuquant", false, FRAMES);
// gif.setFrameRate(60);
// gif.setRepeat(0);

const ctx = createCanvas(WIDTH, HEIGHT).getContext('2d');
ctx.fillStyle = "#111";
ctx.fillRect(0,0,WIDTH,HEIGHT);

function paint(fi) {
    ctx.fillStyle = "#1114";
    ctx.fillRect(0,0,WIDTH,HEIGHT);
    const frame = frames[fi];
    var i;
    var j;
    for(i=0; i<CLR_NUM; i++) {
        ctx.fillStyle = "hsl("+240*(1-i/(CLR_NUM-1))+",55%,55%)";
        ctx.beginPath();
        for(j=frame[i].length-1; j>0; j-=2) ctx.rect(frame[i][j-1], frame[i][j], 1, 1);
        ctx.fill();
    }
}

progress("Prepaint", 20, i => paint(FRAMES-20+i));

createConcurrentEncoder(4, WIDTH, HEIGHT, FRAMES)
.then(({addFrame, getData}) => {
    progress("Painting frames", FRAMES, i => {
        paint(i);
        addFrame(ctx.getImageData(0,0,WIDTH,HEIGHT).data);
    });
    console.log("Further GIF Encoding...")
    start = performance.now();
    return getData;
})
.then(data => {
    console.log(" - Waited "+msStamp(performance.now()-start));
    writeFile('./prova2.gif', data)
})
// writeFile('./prova.gif', gif.out.getData())
.then(() => console.log("Done"))
.catch(err => console.log(err));