<script>
    import FunctionSelect from './FunctionSelect.svelte';
    import ComplexInput from './ComplexInput.svelte';
    import { z1, z2, z3, otherVars } from '../js/variables';
    import fr from '../js/plotFrames';

    /**@param {Event} e*/
    function change_r(e) {
        otherVars.r = parseFloat(e.target.value)
        fr.computeFrames();
    }

    /**@param {Event} e*/
    function change_k(e) {
        const t = e.target;
        let v = Number(t.value);
        if(Number.isNaN(v)) t.value = v = 0;
        else if(!Number.isInteger(v)) t.value = v = Math.round(v);
        otherVars.k = v;
        fr.computeFrames();
    }

</script>

<div class="container">
    <FunctionSelect />
    <h2>Complex numbers</h2>
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
        <input type="number" value={otherVars.r} step="0.1" on:change={change_r}>
        <h3>integer <span class="bold">k</span> =</h3>
        <input type="number" value={otherVars.k} step="1" on:change={change_k}>
    </div>
    <div class="expl">z<sub>k</sub>, k &isin; &integers; &rArr; z &equiv; |z| &ang; (atan2(z) + 2&pi;k)</div>
</div>

<style>
    .container {
        grid-area: vars;
        height: 100%;
        max-height: 100%;
        overflow-y: auto;
        width: 40ch;
        border-right: 3px solid var(--low);
        background-color: var(--bg);
        padding: 1.5rem;
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
    .expl {
        margin-top: 3rem;
        text-align: center;
        color: #e3e3e3;
    }
</style>