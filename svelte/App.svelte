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

<!-- <button class="SC">Play</button> -->
<VarsMenu />
<SettingMenu />
<!-- <div class="overlay" 
    title="Close menus" 
    class:show={show_vars} 
    on:click={() => show_vars = false}>
</div> -->
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
        grid-template-columns: minmax(6rem, 1fr) auto minmax(6rem, 1fr);
        grid-template-rows: 1fr auto 1fr;
        grid-template-areas: 
            "NW   north  NE"
            "west center east"
            "SW   south  SE";
        height: 100%;
        background-color: var(--bg);
        color: white;
        padding: 1.5rem;
    }

    /* .overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 10;
        height: 0;
        width: 0;
        opacity: 0;
        background-color: black;
        transition: opacity .2s;
    }
    .overlay.show {
        height: 100%;
        width: 100%;
        opacity: .4;
    } */

    button {
        grid-area: north;
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
    /* .SC {
        grid-area: south;
        place-self: end center;
    } */
    .time {
        grid-area: SE;
        color: #ccc;
        place-self: end;
    }

</style>
