<script>
    import { complexFunction } from '../js/stores';
    import fr from '../js/plotFrames';
    import fns from '../js/functions'

    // const id = Math.random().toString(36).slice(2);

    let options, onFocus = false;
    $: if(options) {
        if(onFocus) options.focus();
        else options.blur();
    }
    let label = fns.polynomials[0].label;
    complexFunction.set(fns.polynomials[0].fn);

    function sel(opt) {
        label = opt.label;
        complexFunction.set(opt.fn);
        setTimeout(()=>onFocus=false, 10);
        fr.computeFrames();
    }
</script>

<div class="container">
    <button on:click={() => onFocus = !onFocus}>f(x) = {@html label}</button>
    <div class="options" bind:this={options} tabindex="0">
        {#each Object.keys(fns) as key}
            <h3>{key}</h3>
            {#each fns[key] as opt}
                <div class="option" 
                    title={opt.title}
                    on:click={() => sel(opt)}
                    >{@html opt.label}</div>
            {/each}
        {/each}
    </div>
</div>

<style>
    .container {
        display: block;
        position: relative;
    }
    button {
        display: block;
        width: 100%;
        font-size: 1.2rem;
        padding: .5rem 1.2rem;
        color: inherit;
        font-family: inherit;
        background-color: var(--bg);
        border: 2px solid var(--low);
        border-radius: .5rem;
    }
    .options {
        position: absolute;
        bottom: -.5rem;
        left: 0;
        right: 0;
        z-index: 40;
        max-height: 22rem;
        overflow-y: scroll;
        background-color: var(--low);
        color: white;
        border-radius: 1rem;
        padding: 1rem;
        transform: translateY(100%);
        clip-path: inset(0 0 100% 0);
        transition: clip-path .2s;
        box-shadow: 0 0 15px #0005;
    }
    .options::-webkit-scrollbar {
        width: 14px;
    }
    .options::-webkit-scrollbar-track {
        background-color: var(--low);
        margin-bottom: 1rem;
        margin-top: 1rem;
    }
    .options::-webkit-scrollbar-thumb {
        background-color: var(--bg);
        border-radius: 20px;
        border: 4px solid var(--low);
    }
    .options:focus {
        clip-path: inset(-20px);
    }
    h3 {
        text-transform: capitalize;
        margin-bottom: .6rem;
        color: coral;
    }
    .option {
        cursor: pointer;
        padding: .25rem 1.5ch;
        border-radius: .3rem;
    }
    .option:hover {
        background-color: hsl(240, 6%, 25%);
    }
    .option + h3 { margin-top: 1.2rem; }
</style>