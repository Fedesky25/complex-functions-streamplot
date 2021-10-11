<script>
    import { axis, color, life, px_gap } from '../js/stores';
    let show = false;

    /**
     * @param {HTMLInputElement} node 
     * @param {Object} options
     * @param {Number} options.min 
     * @param {Number} options.max 
     * @param {*} options.store 
     * @param {Boolean} options.allowFloat
     * @returns 
     */
    function bounds(node, options) {
        node.value = options.store.initial;
        function change() {
            var v = Number(node.value);
            if(Number.isNaN(v)) node.value = v = options.store.initial;
            else if(v < options.min) node.value = v = options.min;
            else if(v > options.max) node.value = v = options.max;
            else if(!options.allowFloat && !Number.isInteger(v)) node.value = v = Math.round(v);
            options.store.set(v);
        }
        node.addEventListener("change", change);
        return { destroy() { node.removeEventListener("change", change) } }
    }

    let lock = false;

</script>

<div class="container" class:show>
    <div>
        <h2>ViewBox</h2>
        <div class="spaced">
            <h3 class="center">x axis</h3>
            <div>
                <input type="number" class="no-arrows" value={axis.x.min}>
                <input type="number" class="no-arrows" value={axis.x.max}>
            </div>
        </div>
        <div class="spaced">
            <h3 class="center">y axis</h3>
            <div>
                <input type="number" class="no-arrows" value={axis.y.min}>
                <input type="number" class="no-arrows" value={axis.y.max}>
            </div>
        </div>
        <div class="spaced">
            <h3>Lock y axis</h3>
            <input type="checkbox" bind:checked={lock}>
        </div>
        <button class="reset" on:click={axis.reset}>Reset viewbox</button>
    </div>
    <div>
        <h2>Generic</h2>
        <div class="spaced">
            <h3>pixel gap</h3>
            <input type="number" use:bounds={{min: 2, max: 20, store: px_gap}}>
        </div>
        <div class="spaced">
            <h3>life <i class="bracket left"></i>&times;30 frames<i class="bracket right"></i></h3>
            <input type="number" use:bounds={{min: 1, max: 40, store: life}}>
        </div>
        <div class="spaced">
            <h3>Number of colors</h3>
            <input type="number" use:bounds={{min: 2, max: 20, store: color.number}}>
        </div>
        <div class="spaced">
            <h3>Color multiplier</h3>
            <input type="number" use:bounds={{min: -10, max: 10, store: color.factor, mustBeInt: false}}>
        </div>
    </div>
</div>
<button class="toggle-btn" class:rotated={show} on:click={() => show = !show}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><use href="#settings-svg" /></svg>
</button>

<style>
    .toggle-btn {
        top: 0;
        right: 0;
        border-top: 0;
        border-right: 0;
        border-left: 2px solid var(--low);
        border-bottom: 2px solid var(--low);
        border-bottom-left-radius: 1rem;
    }
    svg { transition: transform .2s; }
    .rotated svg { transform: rotate(135deg); }
    
    .container {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 20;

        display: grid;
        grid-template-columns: 30ch 30ch;
        column-gap: 4rem;

        padding: 1.5rem;
        background-color: var(--bg);
        border-left: 3px solid var(--low);
        border-bottom: 3px solid var(--low);
        border-bottom-left-radius: 2rem;
        box-shadow: 0 0 1.5rem #0004;

        transition: clip-path .4s;
        clip-path: circle(0 at top right);
    }
    .container.show { clip-path: circle(calc(142% + 2rem) at top right); }
    h2 {
        margin-bottom: 1.3rem;
    }
    h3 {
        font-weight: 400;
        color: #e3e3e3;
    }
    h3.center {
        text-align: center;
        margin-bottom: .5rem;
    }
    .bracket {
        font-style: normal;
        margin-left: .05ch;
        margin-right: .05ch;
        vertical-align: text-bottom;
    }
    .bracket.left::before { content: '('; }
    .bracket.right::before { content: ')'; }
    input {
        width: 8ch;
    }
    input + input { margin-left: .6ch; }
    .spaced {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .spaced + .spaced {
        margin-top: .8rem;
    }
    button.reset {
        margin-top: .8rem;
        padding: .3rem .7rem;
        font-size: inherit;
        border: 2px solid var(--low);
        border-radius: 5px;
        background-color: var(--bg);
        color: #e3e3e3;
    }
</style>