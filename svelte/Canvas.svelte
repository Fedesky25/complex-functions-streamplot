<script>
    import { setCanvas, suspend } from './animator';
    import { canvas_width, canvas_height } from './constants';
    import { xAxis, yAxis, scaleX, scaleY } from './store';
    import { throttle } from './utils';


    function calcLabels(min, max, num) {
        const res = new Array(num);
        for(var i=0; i<=num; i++) res[i] = (i/num * (max - min) + min).toFixed(2);
        return res;
    }


    let xlabels = [], ylabels = [], xAxisTop=canvas_height/2, yAxisLeft=canvas_width/2;
    $: xlabels = calcLabels($xAxis.min, $xAxis.max, 9);
    $: ylabels = calcLabels($yAxis.min, $yAxis.max, 6);
    $: xAxisTop = $yAxis.max / ($yAxis.max - $yAxis.min) * canvas_height;
    $: yAxisLeft = -$xAxis.min / ($xAxis.max - $xAxis.min) * canvas_width;

    let lastX=0, lastY=0, currentX=0, currentY=0;

    const setDeltas = throttle(function() {
        suspend(true);
        let deltaX = (currentX - lastX) / $scaleX;
        let deltaY = (currentY - lastY) / $scaleY;
        lastX = currentX;
        lastY = currentY;
        // console.log(`dx: ${deltaX.toFixed(3)}\ndy: ${deltaY.toFixed(3)}`);
        xAxis.shift(-deltaX);
        yAxis.shift(deltaY);
        suspend(false);
    }, 50);

    /**@param {MouseEvent} e*/
    function mousemove(e) {
        currentX = e.clientX;
        currentY = e.clientY;
        setDeltas();
    }

    /**@param {MouseEvent} e*/
        function mousedown(e) {
        lastX = e.clientX;
        lastY = e.clientY;
        e.target.style.cursor = 'grabbing';
        e.target.addEventListener('mousemove', mousemove);
    }

    /**@param {MouseEvent} e*/
    function mouseup(e) {
        e.target.style.cursor = 'grab';
        e.target.removeEventListener('mousemove', mousemove);
    }

    // let fact = 1;
    // const setMultiplier = throttle(function() {
    //     suspend(true);
    //     xAxis.multiply(fact);
    //     yAxis.multiply(fact);
    //     fact = 1;
    //     suspend(false);
    // })

    /**@param {WheelEvent} e*/
    function mousewheel(e) {
        if(!e.altKey) return;
        suspend(true);
        let fact = e.deltaY > 0 ? 1.1 : 10/11;
        xAxis.multiply(fact);
        yAxis.multiply(fact);
        suspend(false);
    }
</script>


<div class="canvas-container"
    on:mousedown={mousedown}
    on:mouseup={mouseup}
    on:mousewheel={mousewheel}
    >
    <canvas 
        width={canvas_width} 
        height={canvas_height}
        use:setCanvas
    ></canvas>
    <div class="x-axis" 
        style={xAxisTop > 0 && xAxisTop < canvas_height ? `top: ${xAxisTop}px;` : 'display: none'}>
    </div>
    <div class="y-axis" 
        style={yAxisLeft > 0 && yAxisLeft < canvas_width ? `left: ${yAxisLeft}px;` : 'display: none'}>
    </div>
</div>
<div class="x-labels">
    {#each xlabels as l}
        <div data-label={l}></div>
    {/each}
</div>
<div class="y-labels">
    {#each ylabels as l}
        <div data-label={l}></div>
    {/each}
</div>


<style>
    .canvas-container {
        grid-area: canvas;
        outline: 1px solid #ccc;
        cursor: grab;
        position: relative;
    }
    canvas {
        display: block;
        background-color: var(--bg);
    }
    .x-axis {
        position: absolute;
        left: 2px;
        right: 2px;
        height: 0;
        width: calc(100% - 4px);
        outline: 1px solid #fff3;
    }
    .y-axis {
        position: absolute;
        top: 2px;
        bottom: 2px;
        width: 0;
        height: calc(100% - 4px);
        outline: 1px solid #fff3;
    }

    .x-labels {
        grid-area: x-ticks;
        align-self: start;
        display: flex;
        justify-content: space-between;
    }
    .x-labels > div {
        width: 0;
        height: var(--label-tick-width);
        outline: 1px solid var(--label-color);
        position: relative;
    }
    .x-labels > div::after {
        content: attr(data-label);
        position: absolute;
        bottom: var(--label-spacing);
        left: 0;
        color: var(--label-color);
        font-size: 1.1rem;
        transform: translate(-50%, 100%);
    }

    .y-labels {
        grid-area: y-ticks;
        justify-self: end;
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;
    }
    .y-labels > div {
        width: var(--label-tick-width);
        height: 0;
        outline: 1px solid var(--label-color);
        position: relative;
    }
    .y-labels > div::before {
        content: attr(data-label);
        position: absolute;
        left: var(--label-spacing);
        top: calc(0px - var(--label-tick-thickness) / 2);
        color: var(--label-color);
        font-size: 1.1rem;
        transform: translate(-100%, -50%);
    }
</style>