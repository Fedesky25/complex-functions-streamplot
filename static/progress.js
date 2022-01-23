const { stdout } = require("process");

function display(n) {
    stdout.cursorTo(n);
    stdout.write('\u2588');
    stdout.cursorTo(103);
    stdout.write(n+'%');
}

function progressAbort() {
    stdout.write("\x1B[?25h\n");
    console.log("Uncaugth exception while progressing");
}

function smallProgress(title, times, fn) {
    let i;
    let time;
    console.log(title);
    stdout.write("\x1B[?25l");
    stdout.write('['+'\u2591'.repeat(times)+'] 0/'+times);
    process.on("uncaughtExceptionMonitor", progressAbort);
    time = performance.now();
    for(i=0; i<times; i++) {
        fn(i);
        stdout.cursorTo(i+1);
        stdout.write('\u2588');
        stdout.cursorTo(times+3);
        stdout.write(i+1+'/'+times);
    }
    time = performance.now()-time;
    process.off("uncaughtExceptionMonitor", progressAbort);
    stdout.cursorTo(0);
    stdout.write((" - Completed in "+msStamp(time)).padEnd(times+8)+"\x1B[?25h\n");
    return time;
}

/**
 * Displays a progression bar while executing a function repeatdly
 * @param {string} title title of the operation 
 * @param {number} times number of times to repeat the function
 * @param {function} fn function to execute
 * @returns {number} time elapsed in ms
 */
function progress(title, times, fn) {
    if(times <= 0) return 0;
    if(times <= 100) return smallProgress(title, times, fn);
    let i;
    let j;
    let time;
    let cursor = 0;
    let outer = times % 100;
    let inner = Math.ceil(times / 100);
    console.log(title);
    stdout.write("\x1B[?25l");
    stdout.write('['+'\u2591'.repeat(100)+'] 0%');
    process.on("uncaughtExceptionMonitor", progressAbort);
    time = performance.now();
    for(i=0; i<outer; i++) {
        for(j=0; j<inner; j++) fn(i*inner+j);
        display(++cursor);
    }
    if(outer) inner -= 1;
    for(i=outer; i<100; i++) {
        for(j=0; j<inner; j++) fn(i*inner+j+outer);
        display(++cursor);
    }
    time = performance.now() - time;
    process.off("uncaughtExceptionMonitor", progressAbort);
    stdout.cursorTo(0);
    stdout.write((" - Completed in "+msStamp(time)).padEnd(107)+"\x1B[?25h\n");
    return time;
}

/**
 * Converts milliseconds into adeguate time stamp
 * @param {number} ms milliseconds
 * @returns {string} timestamp
 */
function msStamp(ms) {
    if(ms < 1000) return ms.toPrecision(4) + " ms";
    ms *= 1e-3;
    if(ms < 60) return ms.toPrecision(4) + " s";
    return (ms/60).toFixed(0)+" min "+(ms%60).toFixed(0)+" s";
}

module.exports = { progress, msStamp };