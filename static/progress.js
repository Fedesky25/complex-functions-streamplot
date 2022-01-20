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

/**
 * Displays a progression bar while executing a function repeatdly
 * @param {number} times number of times to repeat the function
 * @param {function} fn function to execute
 */
function progress(times, fn) {
    let i;
    let j;
    let cursor = 0;
    let outer = times % 100;
    let inner = Math.ceil(times / 100);
    stdout.write("\x1B[?25l");
    stdout.write('['+'\u2591'.repeat(100)+'] 0%');
    process.on("uncaughtExceptionMonitor", progressAbort);
    for(i=0; i<outer; i++) {
        for(j=0; j<inner; j++) fn(i*inner+j);
        display(++cursor);
    }
    if(outer) inner -= 1;
    for(i=outer; i<100; i++) {
        for(j=0; j<inner; j++) fn(i*inner+j+outer);
        display(++cursor);
    }
    process.off("uncaughtExceptionMonitor", progressAbort);
    stdout.write("\x1B[?25h\n");
}

module.exports = progress;