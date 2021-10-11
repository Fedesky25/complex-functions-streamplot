<script>
    import VarsMenu from './VarsMenu.svelte';
    import Canvas from './Canvas.svelte';
    import SettingsMenu from './SettingsMenu.svelte';
    import { info } from '../js/stores';
    import { toggle } from '../js/animator';

    var frame, particles, computation;
    info.frame.subscribe(v => frame = v);
    info.particles.subscribe(v => particles = v);
    info.computation.subscribe(v => computation = v);
</script>

<button on:click={e => e.target.textContent = toggle() ? 'Pause' : 'Play'}>Play</button>
<VarsMenu />
<Canvas />
<SettingsMenu />
<div class="info">
    {frame}<br>
    {particles}<br>
    {computation}<br>
</div>

<style>
    button {
        grid-area: top;
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
        margin: 1rem;
    }
    button:focus {outline: none;}
    .info {
        grid-area: info;
        justify-self: end;
        align-self: end;
        color: #fff9;
        text-align: right;
        padding-bottom: 1rem;
        padding-right: 1rem;
    }
</style>