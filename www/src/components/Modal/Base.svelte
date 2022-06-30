<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let divEl: HTMLDivElement;
	const handleClick = (e: any) => {
		if (divEl.contains(e.target)) return;
		dispatch('close');
	};
</script>

<section on:click={handleClick}>
	<div bind:this={divEl}>
		<slot />
	</div>
</section>

<style>
	section {
		display: grid;
		place-items: center;

		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		background: #0005;
		z-index: 2;
		backdrop-filter: blur(2px);
		transition: 0.25s;
	}

	div {
		border-radius: 5px;
		background: rgb(234, 234, 234);
		min-width: 300px;
		min-height: 300px;
		padding: 50px;
	}
</style>
