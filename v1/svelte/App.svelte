<script>
    import Canvas from './Canvas.svelte';
    import Colors from './Colors.svelte';
    import SettingMenu from './SettingMenu.svelte';
    import VarsMenu from './VarsMenu.svelte';

    import { av_frame_time } from './store';
    import { toggle } from './animator';

</script>


<Canvas />
<Colors />
<button on:click={e => e.target.textContent = toggle() ? 'Pause' : 'Play'}>Play</button>
<VarsMenu />
<SettingMenu />
<div class="time">{$av_frame_time} ms</div>


<style>
    :root {
        --bg: hsl(240, 6%, 15%);
        --low: hsl(240, 6%, 20%);
        --label-tick-width: .75rem;
        --label-tick-thickness: 2px;
        --label-spacing: -.2rem;
        --label-color: #ccc;
    }
    :global(html) { height: 100%; }
    :global(body) {
        display: grid;
        /* grid-template-columns: minmax(6rem, 1fr) auto minmax(6rem, 1fr); */
        grid-template-rows: 1fr auto 1fr;
        grid-template-columns: minmax(40ch, 1fr) 7rem  auto minmax(10rem, 1fr);
        grid-template-areas: 
            "vars _1      play    _2"
            "vars y-ticks canvas   colors"
            "vars _3      x-ticks time";
        height: 100%;
        background-color: var(--bg);
        color: white;
    }
    button {
        grid-area: play;
        place-self: center;
        font-size: 1.1em;
        color: white;
        min-width: 11ch;
        padding: .5em 1.4em;
        background: transparent;
        border: 2px solid coral;
        border-radius: .4em;
        cursor: pointer;
        background-color: var(--bg);
    }
    button:focus {outline: none;}
    .time {
        grid-area: time;
        color: #ccc;
        place-self: end;
        padding: 1.5rem;
    }
</style>
