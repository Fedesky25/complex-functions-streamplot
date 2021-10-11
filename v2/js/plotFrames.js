import { axis, color, px_gap, life, info, complexFunction } from './stores';
import { writable } from 'svelte/store';
import debounce from './debounce';
import Complex from './complex';

/**@type {{x: Number, y: Number, s: Number}[][][]} */
let frames = [], clrs = [];
const { subscribe, set } = writable({clrs, frames});

const settings = {
    axis: {
        xMin: -3, xMax: 3,
        yMin: -2, yMax: 2,
    },
    gap: 12,
    life: 120,
    func: null,
}

var thresholds = [];
function clr_index(speed) {
    var i = 1;
    while(speed < thresholds[i]) i++;
    return i-1;
}
function logistic(s) { return 1/(1 + 3*Math.exp(-.1*s)) }

async function cf() {
    const start = performance.now();
    const numX = Math.floor(900/settings.gap);
    const numY = Math.floor(600/settings.gap);
    var i, z, w, shift;
    const life = settings.life;
    const axis = settings.axis;
    const deltaX = axis.xMax - axis.xMin;
    const deltaY = axis.yMax - axis.yMin;
    const avScale = (deltaX/900 + deltaY/600)/2;
    const f = new Array(life);
    const clr_num = clrs.length;
    for(var j=0; j<life; j++) {
        f[j] = new Array(clr_num);
        for(i=0; i<clr_num; i++) f[j][i] = [];
    }
    function particle() {
        w = settings.func(z);
        var speed = Math.sqrt(w.real*w.real + w.imag*w.imag);
        f[i][clr_index(speed)].push({
            x: (z.real - axis.xMin)*900/deltaX,
            y: (axis.yMax - z.imag)*600/deltaY,
            s: speed,
        });
        z.add(w.mul_r( avScale * logistic(speed) / speed ));
    }
    var ix, iy;
    for(ix=0; ix<=numX; ix++) {
        for(iy=0; iy<=numY; iy++) {
            z = new Complex(
                ix/numX*deltaX + axis.xMin,
                iy/numY*deltaY + axis.yMin,
            );
            shift = Math.round(Math.random()*life);
            for(i=shift; i<life; i++) particle();
            for(i=0; i<shift; i++) particle();
        }
    }
    frames = f;
    info.computation.set(`Comp. ${(performance.now()-start).toPrecision(3)} ms`);
    info.particles.set(`Part. ${numX+1}\xd7${numY+1}`);
    set({clrs, frames});
}
const computeFrames = debounce(cf, 100);
axis.subscribe(v => {settings.axis = v; computeFrames()});
px_gap.subscribe(v => {settings.gap = v; computeFrames()});
life.subscribe(v => {settings.life = v*30; computeFrames()});
complexFunction.subscribe(v => {settings.func = v; computeFrames()});

color.all.subscribe(({number: n, thresholds: t, strings: s}) => {
    var c, i;
    thresholds = t;
    frames = frames.map(f => {
        const r = new Array(n);
        for(c=0; c<n; c++) r[c] = [];
        for(c=0; c<n; c++) {
            for(i=f[c].length-1; i>=0; i--) {
                r[clr_index(f[c][i].s)].push(f[c][i])
            }
        }
        return r;
    });
    clrs = s;
    set({clrs, frames});
});


export default { subscribe, computeFrames }