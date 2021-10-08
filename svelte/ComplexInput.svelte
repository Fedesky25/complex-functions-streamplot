<script>
	// import { deg } from './store.js';
	import Complex from './complex';
	import { suspend } from './animator';

	export let number = new Complex();
	
	const inputs = {
		real: null, imag: null,
		mod: null, arg: null,
	};
	// deg.subscribe(d => {
	// 	if(!inputs.arg) return;
	// 	let arg = Math.atan2(number.imag, number.real);
	// 	inputs.arg.value = (d ? arg * 180 : arg) / Math.PI;
	// });
	function RIchange() {
		suspend(true);
		number.real = Number(inputs.real.value) || 0;
		number.imag = Number(inputs.imag.value) || 0;
		inputs.mod.value = Math.sqrt(number.real*number.real + number.imag*number.imag);
		inputs.arg.value = Math.atan2(number.imag, number.real) * 180 / Math.PI;
		// let arg = Math.atan2(number.imag, number.real);
		// inputs.arg.value =  ($deg ? arg * 180 : arg) / Math.PI;
		suspend(false);
	}
	function MAchange() {
		suspend(true);
		let mod = Number(inputs.mod.value);
		let arg = Number(inputs.arg.value) * Math.PI / 180;
		inputs.real.value = number.real = mod * Math.cos(arg);
		inputs.imag.value = number.imag = mod * Math.sin(arg);
		suspend(false);
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
	<!-- {$deg ? '°' : 'π'} -->
</div>
	
<style>
	input {
		width: 6rem;
	}
</style>