import { canvas_width, canvas_height } from './constants';
import { writable, derived } from 'svelte/store';
import Complex from './complex';
import iv from './initial_values';


export const deg = writable(false);

export const av_frame_time = writable('0.000');

/**
 * @param {Number} v 
 * @returns {import('svelte/store').Writable<Number>}
 */
function writable_init(v) {
    const res = writable(v);
    Object.defineProperty(res, "initial", {value: v});
    return res;
}

export const dt_e6 = writable_init(250);

export const particle_life = writable_init(4);

export const px_gap = writable_init(12);

export const clr_num = writable_init(7);
export const clr_factor = writable_init(0);

export const clr_thresholds = derived([clr_num, clr_factor], ([n, f]) => {
    const res = new Array(n+1), mul = Math.pow(100, f/10);
    for(var i=n; i >= 0; i--) res[i] = ( n / i - 1) * mul;
    return res;
});

export const clr_strings = derived(clr_num, n => {
    const res = new Array(n);
    let hue, par;
    for(var i=0; i<n; i++) {
        // hue = i*240/(n-1);
        // hue = i*i * 240 / ((n-1)*(n-1));
        // hue = Math.pow(i/(n-1), 1.4) * 240;
        // hue = i*240/(n-1) * Math.sin(i*Math.PI / (2*n-2));
        hue = 240 * Math.pow(i/(n-1), .6) * Math.sin(i*Math.PI / (2*n-2))
        par = hue*(hue - 360) / 3200;
        res[i] = `hsl(${hue},55%,55%)`;
    }
    return res;
});


function axis(i_min, i_max) {
    const value = {min: i_min, max: i_max}
    const { subscribe, set: _set } = writable(value);
    return {
        subscribe,
        reset() {
            value.min = i_min;
            value.max = i_max;
            _set(value);
        },
        set(min, max) {
            value.min = min;
            value.max = max;
            _set(value);
        },
        shift(delta) {
            value.min += delta;
            value.max += delta;
            _set(value);
        },
        multiply(factor) {
            value.min *= factor;
            value.max *= factor;
            _set(value);
        },
        get min() {return value.min},
        set min(v) {
            if(!Number.isFinite(v)) return;
            value.min = v;
            _set(value);
        },
        get max() {return value.max},
        set max(v) {
            if(!Number.isFinite(v)) return;
            value.max = v;
            _set(value);
        },
        initial: Object.freeze({min: i_min, max: i_max}),
    }
}

export const xAxis = axis(iv.x_min, iv.x_max);
export const yAxis = axis(iv.y_min, iv.y_max);

export const scaleX = derived(xAxis, ({min, max}) => canvas_width / (max - min));
export const scaleY = derived(yAxis, ({min, max}) => canvas_height / (max - min));

export const initial_complexs = derived([px_gap, xAxis, yAxis], ([gap, x, y]) => {
    const numX = Math.floor(canvas_width/gap);
    const numY = Math.floor(canvas_height/gap);
    const res = new Array((numX+1)*(numY+1));
    console.log(`Particle number: ${numX+1}\xd7${numY+1} = ${(numX+1)*(numY+1)}`);
    let i, j;
    for(i=0; i<=numY; i++) 
        for(j=0; j<=numX; j++)
            res[i*(numX+1)+j] = new Complex( j/numX*(x.max-x.min) + x.min, i/numY*(y.max-y.min) + y.min );
    return res;
});
