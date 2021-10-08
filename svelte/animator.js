import Complex from './complex.js';
import { canvas_width as w, canvas_height as h } from './constants';
import { 
    av_frame_time, xAxis, yAxis, scaleX, scaleY, initial_complexs,
    particle_life, dt_e6,
    clr_thresholds, clr_strings, clr_num 
} from './store';
import { complex_function } from './variables';
import { debouce } from './utils'

/**@type {(c: Complex) => Complex} */ let func;
complex_function.subscribe(fn => func = fn);


let frame_request = null, suspended = false, /**@type {CanvasRenderingContext2D} */ ctx;
let i, t, time=0, counter = 0;


let xMin, $scaleX, yMax, $scaleY;
xAxis.subscribe(v => xMin = v.min);
yAxis.subscribe(v => yMax = v.max);
scaleX.subscribe(v => $scaleX = v);
scaleY.subscribe(v => $scaleY = v);

let $clr_thresholds = [], $clr_strings = [], $clr_num=10;
clr_thresholds.subscribe(v => $clr_thresholds = v);
clr_strings.subscribe(v => $clr_strings = v);
clr_num.subscribe(v => $clr_num = v);

let
    /**@type {Complex[]}*/initials,
    /**@type {Complex[]}*/currents, 
    /**@type {Number[]}*/speeds, 
    /**@type {Number[]}*/lives, 
    /**@type {Number}*/len = 0,
    /**@type {Number}*/maxLife=120;
particle_life.subscribe(v => {
    v *= 30;
    for(i=0; i<len; i++) lives[i] = Math.round(lives[i]/maxLife * v);
    maxLife = v;
});
initial_complexs.subscribe(v => {
    initials = v;
    currents = v.map(c => new Complex().eq(c));
    speeds = new Array(v.length);
    len = v.length;
    lives = new Array(len);
    for(i=0; i<len; i++) lives[i] = Math.floor(Math.random()*maxLife);
    if(ctx) {
        ctx.fillStyle = 'hsl(240,6%,15%)';
        ctx.fillRect(0, 0, w, h);
    }
});
let dt; dt_e6.subscribe(v => dt = v * 1e-6);


/**@param {HTMLCanvasElement} node */
export function setCanvas(node) {
    ctx = node.getContext('2d');
    ctx.fillStyle = 'hsl(240, 6%, 15%)';
    ctx.fillRect(0, 0, w, h);
}

/**@param {Complex} c */
function draw(c) {
    ctx.fillRect(
        (c.real - xMin)*$scaleX - .5,
        (yMax - c.imag)*$scaleY - .5,
        1, 1,
    );
}

function logistic(x) { return 1/(1 + 3*Math.exp(-0.1*x)) }

function frame() {
    var start = performance.now();
    if(++counter > 300) {
        av_frame_time.set((time/counter).toFixed(3));
        time = counter = 0;
    }
    ctx.fillStyle = 'hsla(240,6%,15%,.01)';
    ctx.fillRect(0, 0, w, h);
    var temp;
    for(i=0; i<len; i++) {
        lives[i]++;
        if(lives[i] > maxLife) {
            currents[i].eq(initials[i]);
            lives[i] = 0;
        }
        temp = func(currents[i]);
        speeds[i] = Math.sqrt(temp.real*temp.real + temp.imag*temp.imag);
        currents[i].add( temp.mul_r( logistic(speeds[i]) / (speeds[i]*$scaleX) ) );
    }
    var low, high;
    for(t=0; t<$clr_num; t++) {
        ctx.fillStyle = $clr_strings[t];
        low = $clr_thresholds[t+1];
        high = $clr_thresholds[t];
        for(i=0; i<len; i++) {
            if(speeds[i] < high && speeds[i] >= low)
                draw(currents[i]);
        }
    }
    frame_request = requestAnimationFrame(frame);
    time += performance.now() - start;
}

export function play() {
    if(!ctx || suspended || frame_request) return;
    frame_request = requestAnimationFrame(frame);
}

export function pause(ms) {
    if(!frame_request) return;
    cancelAnimationFrame(frame_request);
    frame_request = null;
    if(ms) setTimeout(play, ms); 
}

export function toggle() {
    if(suspended) return false;
    if(frame_request) {
        cancelAnimationFrame(frame_request);
        frame_request = null;
        return false;
    } else {
        if(!ctx) return false;
        frame_request = requestAnimationFrame(frame);
        return true;
    }
} 


const unsusped = debouce(function() {
    if(suspended && frame_request) frame_request = requestAnimationFrame(frame);
    suspended = false;
}, 100);

export function suspend(flag) {
    if(flag) {
        unsusped.cancel();
        if(frame_request) cancelAnimationFrame(frame_request);
        suspended = true;
    } else if(suspended) unsusped();
}