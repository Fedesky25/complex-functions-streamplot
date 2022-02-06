<script>
    import { axis, complexFunction } from '../js/stores';
    import throttle from '../js/throttle';
    import debouce from '../js/debounce';
    import { setCanvas } from '../js/animator';
    import Complex from '../js/complex';
 
    let 
        scaleX = 0, scaleY = 0,
        xlabels = [], ylabels = [], 
        xAxisTop = 300, yAxisLeft = 450;
    function calcLabels(min, max, num) {
        const res = new Array(num);
        for(var i=0; i<=num; i++) res[i] = (i/num * (max - min) + min).toFixed(2);
        return res;
    }
    axis.subscribe(a => {
        scaleX = (a.xMax - a.xMin) / 900;
        scaleY = (a.yMax - a.yMin) / 600;
        xAxisTop = a.yMax / (a.yMax - a.yMin) * 600;
        yAxisLeft = a.xMin / (a.xMin - a.xMax) * 900;
        xlabels = calcLabels(a.xMin, a.xMax, 9);
        ylabels = calcLabels(a.yMin, a.yMax, 6);
    });

    let 
        lastX=0, lastY=0, 
        currentX=0, currentY=0, 
        moving=false, pos='', showPos=false;
    const z = new Complex();

    const hidePos = debouce(() => showPos=false, 3000);
    const calcPos = throttle(function(){
        showPos = true;
        var x = currentX * scaleX + axis.xMin;
        var y = axis.yMax - currentY * scaleY;
        z.becomes(x,y);
        pos = `${z} → ${$complexFunction(z)}`;
        hidePos();
    }, 50);

    const setDeltas = throttle(function(){
        var deltaX = (currentX - lastX) * scaleX;
        var deltaY = (currentY - lastY) * scaleY;
        lastX = currentX;
        lastY = currentY;
        axis.shift(-deltaX, deltaY);
    }, 50);

    /**@param {MouseEvent} e*/
    function mousemove(e) {
        currentX = e.offsetX;
        currentY = e.offsetY;
        if(moving) setDeltas();
        else calcPos();
    }

    /**@param {MouseEvent} e*/
    function mousedown(e) {
        lastX = e.offsetX;
        lastY = e.offsetY;
        e.target.style.cursor = 'grabbing';
        moving = true;
    }

    /**@param {MouseEvent} e*/
    function mouseup(e) {
        e.target.style.cursor = 'crosshair';
        moving = false;
    }

    /**@param {WheelEvent} e*/
    function wheel(e) {
        if(!e.altKey) return;
        let fact = e.deltaY > 0 ? 1.1 : 10/11;
        axis.scale(fact)
    }

</script>

<div class="container">
    <canvas width="900" height="600"
        on:mousedown={mousedown}
        on:mouseup={mouseup}
        on:mousemove={mousemove}
        on:wheel|passive={wheel}
        use:setCanvas>
    </canvas>
    <div class="position" class:show={showPos}>{pos}</div>
    <div class="x-axis"
        style={xAxisTop > 0 && xAxisTop < 600 ? `top: ${xAxisTop}px;` : 'display: none'}>
    </div>
    <div class="y-axis"
        style={yAxisLeft > 0 && yAxisLeft < 900 ? `left: ${yAxisLeft}px;` : 'display: none'}>
    </div>
    <div class="x-label">
        {#each xlabels as l}
            <div data-label={l}></div>
        {/each}
    </div>
    <div class="y-label">
        {#each ylabels as l}
            <div data-label={l}></div>
        {/each}
    </div>
</div>

<style>
    .container {
        grid-area: canvas;
        place-self: center;
        position: relative;
        margin-left: 4rem;
    }
    canvas {
        display: block;
        background-color: var(--bg);
        cursor: crosshair;
        outline: 1px solid #fff9;
    }

    .position {
        position: absolute;
        top: 0;
        right: 0;
        transform: translateY(-100%);
        padding-bottom: .15rem;
        color: #fff;
        opacity: 0;
        transition: opacity .35s;
    }
    .position.show { opacity: .5; }

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

    .x-label {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        transform: translateY(100%);
        display: flex;
        justify-content: space-between;
    }
    .x-label > div {
        width: 0;
        height: var(--label-tick-width);
        outline: 1px solid var(--label-color);
        position: relative;
    }
    .x-label > div::after {
        content: attr(data-label);
        position: absolute;
        bottom: var(--label-spacing);
        left: 0;
        color: var(--label-color);
        font-size: 1.1rem;
        transform: translate(-50%, 100%);
    }

    .y-label {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        height: 100%;
        transform: translateX(-100%);
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;
    }
    .y-label > div {
        width: var(--label-tick-width);
        height: 0;
        outline: 1px solid var(--label-color);
        position: relative;
    }
    .y-label > div::before {
        content: attr(data-label);
        position: absolute;
        left: var(--label-spacing);
        top: calc(0px - var(--label-tick-thickness) / 2);
        color: var(--label-color);
        font-size: 1.1rem;
        transform: translate(-100%, -50%);
    }
</style>