import { writable, derived } from 'svelte/store';
import Complex from './complex';


export const axis = (function(){
    const value = {
        xMin: -3,
        xMax: 3,
        yMin: -2,
        yMax: 2,
    }
    const { subscribe, set } = writable(value);
    return Object.freeze({
        subscribe,
        shift(xShift, yShift) {
            value.xMin += xShift;
            value.xMax += xShift;
            value.yMin += yShift;
            value.yMax += yShift;
            set(value);
        },
        reset() {
            value.xMin = -3;
            value.xMax = 3;
            value.yMin = -2;
            value.yMax = 2;
            set(value);
        },
        x: {
            get min() {return value.xMin},
            set min(v) {
                value.xMin = v;
                set(value);
            },
            get max() {return value.xMax},
            set max(v) {
                value.xMax = v;
                set(value);
            },
        },
        y: {
            get min() {return value.yMin},
            set min(v) {
                value.yMin = v;
                set(value);
            },
            get max() {return value.yMax},
            set max(v) {
                value.yMax = v;
                set(value);
            },
        },
    })
})();

export const scale = derived(axis, a => ({x: 900/(a.xMax - a.xMin), y: 600/(a.yMax - a.yMin)}));

export const px_gap = writable(12);

export const life = writable(3);

const clr_num = writable(8);
const clr_factor = writable(0);
const clr_thresholds = derived([clr_num, clr_factor], ([n, f]) => {
    const res = new Array(n+1), mul = Math.pow(100, f/10);
    for(var i=n; i >= 0; i--) res[i] = ( n / i - 1) * mul;
    return res;
});
const clr_strings = derived(clr_num, n => {
    const res = new Array(n);
    let hue, par;
    for(var i=0; i<n; i++) {
        hue = 240 * Math.pow(i/(n-1), .6) * Math.sin(i*Math.PI / (2*n-2))
        par = hue*(hue - 360) / 3200;
        res[i] = `hsl(${hue},55%,55%)`;
    }
    return res;
});
export const color = Object.freeze({
    number: clr_num,
    factor: clr_factor,
    strings: clr_strings,
    thresholds: clr_thresholds,
    all: derived(
        [clr_num, clr_factor, clr_strings, clr_thresholds],
        ([n, f, s, t]) => ({number: n, factor: f, strings: s, thresholds: t})
    ),
});

export const info = Object.freeze({
    computation: writable(""),
    particles: writable(""),
    frame: writable(""), 
});

export const complexFunction = writable(c => new Complex(c.real, c.imag));