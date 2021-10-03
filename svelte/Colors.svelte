<script>
    import { clr_thresholds, clr_strings, clr_num, clr_factor } from './store';

    let gradient = '';
    clr_strings.subscribe(cs => {
        let arr = [], perc;
        const len = cs.length;
        for(var t=0; t<len-1; t++) {
            perc = (t+1)*100/len;
            arr.push(`${cs[t]} ${perc}%, ${cs[t+1]} ${perc}%`);
        }
        gradient = arr.join(', ');
    });

</script>

<div class="container">
    <!-- <div class="num">
        <button on:click={clr_num.decrement}>-</button>
        <input type="number" class="no-arrows" value={clr_num.initial} use:clr_num.bindInput>
        <button on:click={clr_num.increment}>+</button>
    </div> -->
    <div class="labels">
        {#each $clr_thresholds as t}
           <div data-num={t.toPrecision(3)}></div> 
        {/each}
    </div>
    <div class="bar" style="background: linear-gradient(to bottom, {gradient});"></div>
    <!-- <div class="factor">
        <button on:click={clr_factor.decrement}>-</button>
        <input type="number" class="no-arrows" value={clr_factor.initial} use:clr_factor.bindInput>
        <button on:click={clr_factor.increment}>+</button>
    </div> -->
</div>

<style>
    .container {
        grid-area: east;
        justify-self: end;
        display: grid;
        grid-template-columns: 1fr auto;
        /* grid-template-rows: auto 1fr auto;
        row-gap: 2rem; */
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
    /* .num {
        grid-row: 1;
        grid-column: 1/3;
    }
    .factor {
        grid-row: 3;
        grid-column: 1/3;
    } */
    .bar {
        grid-column: 2;
        /* grid-row: 2; */
        width: 1ch;
        background-color: aquamarine;
    }
    .labels {
        grid-column: 1;
        /* grid-row: 2; */
        justify-self: end;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .labels > div {
        height: 0;
        width: 1.3ch;
        border: 0;
        outline: 1px solid white;
        position: relative;
    }
    .labels > div::before {
        content: attr(data-num);
        position: absolute;
        left: -1.2ch;
        top: 50%;
        transform: translate(-100%, -50%);
        color: white;
    }
    /* input {
        width: 8ch;
        text-align: center;
    }
    button {
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        border: 0;
        border-radius: 50%;
        background-color: hsl(240, 6%, 20%);
        color: white;
        font-weight: 700;
    }
    button:focus {
        outline: none;
    } */
</style>