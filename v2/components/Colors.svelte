<script>
    import { color } from '../js/stores'

    let nums = [], gradient = "red";
    color.thresholds.subscribe(v => nums = v);
    color.strings.subscribe(cs => {
        let arr = [], perc;
        const len = cs.length;
        for(var t=0; t<len-1; t++) {
            perc = (t+1)*100/len;
            arr.push(`${cs[t]} ${perc}%, ${cs[t+1]} ${perc}%`);
        }
        gradient = arr.join(', ');
    })

</script>

<div class="container">
    <div class="labels">
        {#each nums as t}
           <div data-num={t.toPrecision(3)}></div> 
        {/each}
    </div>
    <div class="bar" style="background: linear-gradient(to bottom, {gradient});"></div>
</div>

<style>
    .container {
        grid-area: color;
        justify-self: end;
        display: grid;
        grid-template-columns: 1fr auto;
        /* grid-template-rows: auto 1fr auto;
        row-gap: 2rem; */
        padding: 3rem 1.5rem;
    }
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
</style>