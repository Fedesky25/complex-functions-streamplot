const { stdout } = require("process");

function display(n) {
    stdout.cursorTo(n);
    stdout.write('\u2588');
    stdout.cursorTo(103);
    stdout.write(n+'%');
}

function progress(times, fn) {
    let i;
    let j;
    let cursor = 0;
    let outer = times % 100;
    let inner = Math.ceil(times / 100);
    stdout.write("\x1B[?25l");
    stdout.write('['+'\u2591'.repeat(100)+'] 0%');
    for(i=0; i<outer; i++) {
        for(j=0; j<inner; j++) fn();
        display(++cursor);
    }
    if(outer) inner -= 1;
    outer = 100 - outer;
    for(i=0; i<outer; i++) {
        for(j=0; j<inner; j++) fn();
        display(++cursor);
    }
    stdout.write("\x1B[?25h\n");
}

module.exports = progress;