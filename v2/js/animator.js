import plotFrames from "./plotFrames";
import { info } from './stores';

var frame_request = null, /**@type {CanvasRenderingContext2D} */ ctx;
var frame_index=0, time=0, counter = 0;

var clrs = [], frames = [];
plotFrames.subscribe(v => {
    clrs = v.clrs;
    frames = v.frames;
    console.log(frames)
});


/**@param {HTMLCanvasElement} node */
export function setCanvas(node) {
    ctx = node.getContext('2d');
    ctx.fillStyle = 'hsl(240, 6%, 15%)';
    ctx.fillRect(0, 0, 900, 600);
}


function draw() {
    const start = performance.now();
    if(++counter > 240) {
        info.frame.set((time/counter).toFixed(3) + ' ms');
        time = counter = 0;
    }
    ctx.fillStyle = 'hsla(240,6%,15%,.01)';
    ctx.fillRect(0, 0, 900, 600);
    if(frame_index >= frames.length) frame_index=0;
    const frame = frames[frame_index];
    var i, c;
    for(c=frame.length-1; c>=0; c--) {
        ctx.fillStyle = clrs[c];
        for(i=frame[c].length-1; i>=0; i--) {
            ctx.fillRect(frame[c][i].x-.5, frame[c][i].y-.5, 1, 1)
        }
    }
    frame_index++;
    frame_request = requestAnimationFrame(draw);
    time += performance.now() - start;
}

export function toggle() {
    if(frame_request) {
        cancelAnimationFrame(frame_request);
        frame_request = null;
        return false;
    } else {
        frame_request = requestAnimationFrame(draw);
        return true;
    }
}