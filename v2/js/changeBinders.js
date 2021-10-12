/**
 * @param {HTMLInputElement} node 
 * @param {import("svelte/store").Writable<Number>} store 
 */
export function onNumberChange(node, store) {
    let skip = false;
    store.subscribe(v => {
        if(skip) skip = false;
        else node.value = v;
    });
    function change(e) {
        skip = true;
        store.set(+e.target.value);
    }
    node.addEventListener("change", change);
    return { destroy() { node.removeEventListener("change", change) } }
}