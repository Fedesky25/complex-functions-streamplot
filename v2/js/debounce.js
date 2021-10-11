/**
 * @param {Function} fn 
 * @param {Number} delay 
 * @returns 
 */
export default function debounce(fn, delay) {
    let timer;
    function res() {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    }
    res.cancel = () => clearTimeout(timer);
    return res;
}