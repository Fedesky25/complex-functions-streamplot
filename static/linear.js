/**
 * @typedef {{
 * (value: number) => number, 
 * domain: (min: number, max: number) => linearScale,
 * range: (min: number, max: number) => linearScale
 * }} linearScale
 */
/**
 * Constructs a new linear scale
 * @returns {linearScale}
 */
export function linearScale() {
    var from_min = 0;
    var from_dim = 1;
    var to_min = 0;
    var to_dim = 1;
    const compute = v => (v-from_min)/from_dim*to_dim + to_min;
    compute.domain = (min, max) => {
        from_min = min;
        from_dim = max-min;
        return compute;
    }
    compute.range = (min, max) => {
        to_min = min;
        to_dim = max-min;
        return compute;
    }
    return compute;
}