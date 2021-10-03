<script>
    import FunctionSelect from './FunctionSelect.svelte';
    import ComplexInput from './ComplexInput.svelte';
    import { z1, z2, z3, otherVars } from './variables';
    import { deg } from './store';
    let show = false;

    /**@param {Event} e*/
    function change_k(e) {
        const t = e.target;
        let v = Number(t.value);
        if(Number.isNaN(v)) t.value = v = 0;
        else if(!Number.isInteger(v)) t.value = v = Math.round(v);
        otherVars.k = v;
    }

</script>

<div class="container" class:show>
    <FunctionSelect />
    <h2>Complex numbers</h2>
    <label>Degree angles: <input type="checkbox" on:change={e => deg.set(e.target.checked)}></label>
    <div class="centering-col">
        <h3>z<sub>1</sub></h3>
        <ComplexInput number={z1}/>
        <h3>z<sub>2</sub></h3>
        <ComplexInput number={z2} />
        <h3>z<sub>3</sub></h3>
        <ComplexInput number={z3} />
    </div>
    <h2>Other numbers</h2>
    <div class="aligned">
        <h3>real <span class="bold">r</span> =</h3>
        <input type="number" value={otherVars.r} step="0.01"
            on:change={e => otherVars.r = parseFloat(e.target.value)}>
        <h3>integer <span class="bold">k</span> =</h3>
        <input type="number" value={otherVars.k} step="1" on:change={change_k}>
    </div>
</div>
<button class="toggle-btn" on:click={() => show = !show}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><use href="#function-svg" /></svg>
</button>
<!-- <div class="overlay" class:show 
    on:click={() => show = false}
    title="Click to close variables panel">
</div> -->

<style>
    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 20;
        max-height: 100%;
        overflow-y: auto;
        width: 40ch;
        padding: 1.5rem;
        border-right: 3px solid var(--low);
        box-shadow: 0 0 1.5rem #0004;
        background-color: var(--bg);
        transition: clip-path .35s;
        clip-path: inset(0 100% 0 0);
    }
    .container.show {
        clip-path: inset(0 -2rem 0 0);
    }
    .toggle-btn {
        top: 0;
        left: 0;
        border-top: 0;
        border-left: 0;
        border-right: 2px solid var(--low);
        border-bottom: 2px solid var(--low);
        border-bottom-right-radius: 1rem;
    }
    h3 {
        font-size: 1.3rem;
        font-weight: 400;
        color: #e3e3e3;
    }
    .bold {
        font-weight: 700;
        color: white;
    }
    h2 { margin-top: 2rem; }
    .centering-col {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .centering-col h3 {
        margin-top: 1rem;
        margin-bottom: .4rem;
    }
    .aligned {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1ch;
        row-gap: .5rem;
        align-items: center;
        margin-top: 1.3rem;
    }
    .aligned h3 {
        grid-column: 1;
        justify-self: end;
    }
    .aligned input {
        grid-column: 2;
        justify-self: start;
    }
    /* .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        width: 0;
        height: 0;
        background-color: black;
        opacity: 0;
        transition: opacity .35s;
    }
    .overlay.show {
        width: 100%;
        height: 100%;
        opacity: .6;
    } */
</style>