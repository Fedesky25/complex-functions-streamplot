export function debouce(fn, delay) {
    let timer;
    function res() {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    }
    res.cancel = () => clearTimeout(timer);
    return res;
}

/**
 * @param {Function} fn
 * @param {Number} delay
 */
export function throttle(fn, delay) {
    let waiting = false;
    return () => {
        if(waiting) return;
        waiting = true;
        setTimeout(() => {
            fn();
            waiting = false;
        }, delay);
    }
}

/**
 * @param {HTMLInputElement} node 
 * @param {Object} options
 * @param {Number} [options.min=1] 
 * @param {Number} options.max 
 * @param {*} options.store 
 * @param {Boolean} [options.mustBeInt=true]
 * @returns 
 */
export function forceBounds(node, options) {
    let v;
    const min = Number.isFinite(options.min) ? options.min : 1;
    if(!Number.isFinite(options.max)) throw Error("no valid max option");
    const max = options.max;
    if(!options.store) throw Error("No store");
    if(typeof options.store.initial !== "number") throw Error("No initial value on store");
    const store = options.store;
    const mustBeInt = options.mustBeInt == null ? false : Boolean(options.mustBeInt);
    node.min = min;
    node.max = max;
    node.value = store.initial;
    function change() {
        v = Number(node.value);
        if(Number.isNaN(v)) node.value = v = store.initial;
        else if(v < min) node.value = v = min;
        else if(v > max) node.value = v = max;
        else if(mustBeInt && !Number.isInteger(v)) node.value = v = Math.round(v);
        store.set(v);
    }
    node.addEventListener("change", change);
    return { destroy() { node.removeEventListener("change", change) } }
}