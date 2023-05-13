<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { elasticOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	const dispatch = createEventDispatcher();

	export let title: string = 'Modal';

	let divEl: HTMLDivElement;
	const handleClick = (e: any) => {
		if (divEl.contains(e.target)) return;
		dispatch('close');
	};

	const blurTransition = (node: HTMLElement) => ({
		duration: 250,
		easing: elasticOut,
		css: (t: number) => `
			backdrop-filter: blur(${t * 2}px);
			opacity: ${t};
		`,
	});
</script>

<section on:click={handleClick} on:keydown={handleClick} transition:blurTransition>
	<div class="container" bind:this={divEl} transition:scale={{ duration: 150 }}>
		<header>
			<button class="close-btn" on:click={() => dispatch('close')}>
				<img src="/close.svg" alt="close">
			</button>
		</header>
		<div class="main-centerer">
			<main>
				<h1>{title}</h1>
				<slot />
			</main>
		</div>
		<footer>
			<slot name="footer" />
		</footer>
	</div>
</section>

<style>
	section {
		display: grid;
		place-items: center;
		grid-gap: 10px;

		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		background: #0001;
		z-index: 10;
		backdrop-filter: blur(2px);
	}

	.container {
		border-radius: 15px;
		background: white;
		min-width: 600px;
		min-height: 300px;
	}

	header {
		display: flex;
		justify-content: flex-end;
		padding: 20px;
	}

	.main-centerer {
		display: flex;
		justify-content: center;
	}
	main {
		padding: 50px;
		padding-top: 0px;
	}
	footer {
		padding: 50px;
		padding-top: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	h1 {
		margin-bottom: 2rem;
	}
	.close-btn {
		box-shadow: none;
		border: none;
		background: none;
		cursor: pointer;
		padding: .5rem;
	}
	button img {
		height: 16px;
	}
</style>
