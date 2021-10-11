<script>
	import Complex from '../js/complex';
	import fr from '../js/plotFrames';

	export let number = new Complex();
	
	const inputs = {
		real: null, imag: null,
		mod: null, arg: null,
	};
	function RIchange() {
		number.real = Number(inputs.real.value) || 0;
		number.imag = Number(inputs.imag.value) || 0;
		inputs.mod.value = Math.sqrt(number.real*number.real + number.imag*number.imag);
		inputs.arg.value = Math.atan2(number.imag, number.real) * 180 / Math.PI;
        fr.computeFrames();
	}
	function MAchange() {
		let mod = Number(inputs.mod.value);
		let arg = Number(inputs.arg.value) * Math.PI / 180;
		inputs.real.value = number.real = mod * Math.cos(arg);
		inputs.imag.value = number.imag = mod * Math.sin(arg);
        fr.computeFrames();
	}
</script>

<div>
	=
    <input type="number" value={number.real} class="no-arrows"
	    bind:this={inputs.real} 
		on:change={RIchange} />
	+
    <input type="number" value={number.imag} class="no-arrows"
		bind:this={inputs.imag} 
		on:change={RIchange} />i<br>
	=
    <input type="number" value={Math.sqrt(number.real*number.real + number.imag*number.imag)} class="no-arrows"
		bind:this={inputs.mod}
		on:change={MAchange} />
	&ang;
    <input type="number" value={Math.atan2(number.imag, number.real) * 180 / Math.PI} class="no-arrows"
        bind:this={inputs.arg}
        on:change={MAchange} />&deg;
</div>
	
<style>
	input {
		width: 6rem;
	}
</style>