const { parentPort, workerData } = require("worker_threads");
const { GIFEncoder, applyPalette, quantize } = require("gifenc/dist/gifenc");

const { width, height, format } = workerData;
const gif = GIFEncoder({auto: false});

parentPort.on("message", v => {
    const [data, frame] = v;
    const palette = quantize(data, 64, {format});
    const index = applyPalette(data, palette, format);
    gif.writeFrame(index, width, height, {
        first: !frame,
        repeat: 0,
        palette
    });
    const output = gif.bytesView();
    parentPort.postMessage([output, frame], [output.buffer]);
    gif.reset();
});

parentPort.postMessage("ready");