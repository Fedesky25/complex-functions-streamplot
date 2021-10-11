/**
 * @param {Function} fn
 * @param {Number} delay
 */
export default function throttle(fn, delay) {
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