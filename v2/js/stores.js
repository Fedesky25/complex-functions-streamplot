import { writable, derived } from 'svelte/store';
import Complex from './complex';


export const axis = (function(){
    let lock = true;
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
        scale(factor) {
            const xMiddle = (value.xMin + value.xMax) / 2;
            const xDelta = (value.xMax - xMiddle) * factor;
            value.xMin = xMiddle - xDelta;
            value.xMax = xMiddle + xDelta;
            const yMiddle = (value.yMin + value.yMax) / 2;
            const yDelta = (value.yMax - yMiddle) * factor;
            value.yMin = yMiddle - yDelta;
            value.yMax = yMiddle + yDelta;
            set(value);
        },
        reset() {
            value.xMin = -3;
            value.xMax = 3;
            value.yMin = -2;
            value.yMax = 2;
            set(value);
        },
        get xMin() {return value.xMin},
        set xMin(v) {
            if(lock) value.yMin += (v-value.xMin) * 2/3;
            value.xMin=v;
            set(value);
        },
        get xMax() {return value.xMax},
        set xMax(v) {
            if(lock) value.yMax += (v-value.xMin) * 2/3;
            value.xMax=v;
            set(value)
        },
        get yMin() {return value.yMin},
        set yMin(v) {
            if(lock) value.xMin += (v-value.yMin) * 1.5;
            value.yMin=v;
            set(value);
        },
        get yMax() {return value.yMax},
        set yMax(v) {
            if(lock) value.xMax += (v-value.yMax) * 1.5;
            value.yMax=v;
            set(value);
        },
        get locked() {return lock},
        set locked(v) {
            lock = v;
            if(v) {
                const xMiddle = (value.xMax+value.xMin)/2;
                const yMiddle = (value.yMax+value.yMin)/2;
                const average = (Math.abs(value.xMax-xMiddle)*3 + Math.abs(value.yMax-yMiddle)*2) / 5;
                // * 3 / mean(2,3) = 1.2
                value.xMin = xMiddle - average*1.2;
                value.xMax = xMiddle + average*1.2;
                // * 2 / mean(2,3) = 0.8;
                value.yMin = yMiddle - average*0.8;
                value.yMax = yMiddle + average*0.8;
                set(value);
            }
        },
    });
})();

export const scale = derived(axis, a => ({x: 900/(a.xMax - a.xMin), y: 600/(a.yMax - a.yMin)}));

/**@param {Number} v*/
function writable_init(v) {
    const res = writable(v);
    Object.defineProperty(res, 'initial', {value: v});
    return res;
}

export const px_gap = writable_init(12);
export const life = writable_init(4);

const clr_num = writable_init(8);
const clr_factor = writable_init(0);
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
const clr_all = derived(
    [clr_thresholds, clr_strings, clr_num, clr_factor],
    ([t, s, n, f]) => ({number: n, factor: f, strings: s, thresholds: t})
);
export const color = Object.freeze({
    number: clr_num,
    factor: clr_factor,
    strings: clr_strings,
    thresholds: clr_thresholds,
    all: clr_all,
});

export const info = Object.freeze({
    computation: writable(""),
    particles: writable(""),
    frame: writable(""), 
});

export const complexFunction = writable(c => new Complex(c.real, c.imag));