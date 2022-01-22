const { Worker } = require("worker_threads");
const { GIFEncoder } = require('gifenc/dist/gifenc');

/**
 * Creates a GIF encoder that uses multiple workers
 * @param {number} width width of the gif
 * @param {number} height heigth of the gif
 * @param {number} frames number of frames
 * @param {number} threads number of threads
 * @param {(t: number) => void} [onProgress] callback executed after each computed frame
 */
async function createConcurrentEncoder(threads, width, height, frames, onProgress = emptyFunc) {
    const workerData = { width, height, format: "rgb444" };
    /**@type {Worker[]} */
    const workers = new Array(threads);
    for(var i=0; i<threads; i++) workers[i] = new Worker("./static/worker.js", {workerData});
    await Promise.all(workers.map(waitForReady));

    const resolvers = new Array(frames);
    const promises = new Array(frames);
    for(var i=0; i<frames; i++) { promises[i] = new Promise(resolve => { resolvers[i] = resolve }); }
    let currentFrame = 0;
    let workerIndex = 0;
    let doneByNow = 0;
    
    for(var i=0; i<threads; i++) workers[i].on("message", obj => {
        const [data, frame] = obj;
        resolvers[frame](data);
        onProgress(++doneByNow);
    });

    return Object.freeze({
        /**
         * Adds a frame
         * @param {Uint8Array} data 
         */
        addFrame(data) {
            const w = workers[workerIndex];
            workerIndex = (workerIndex+1)%threads;
            w.postMessage([data, currentFrame], [data.buffer]);
            currentFrame++;
        },
        getData: Promise.all(promises).then(writeGif)
    });

    /**@param {Uint8Array[]} chuncks */
    function writeGif(chuncks) {
        let i;
        const gif = GIFEncoder({auto: false});
        gif.writeHeader();
        for(i=0; i<chuncks.length; i++) gif.stream.writeBytesView(chuncks[i]);
        gif.finish();
        for(i=0; i<threads; i++) workers[i].terminate();
        workers.length = 0;
        return gif.bytesView();
    }
}

/**
 * Returns a promise that resolves when the worker is ready
 * @param {Worker} w worker
 * @returns {Promise<void, string>}
 */
function waitForReady(w) {
    return new Promise((resolve, reject) => w.once("message", msg => {
        if(msg === "ready") resolve();
        else reject("Worker sent unrecognized message: " + msg);
    }))
}

function emptyFunc() {}

module.exports = createConcurrentEncoder;