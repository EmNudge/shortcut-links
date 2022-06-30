<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let title: string = 'Modal';

	let divEl: HTMLDivElement;
	const handleClick = (e: any) => {
		if (divEl.contains(e.target)) return;
		dispatch('close');
	};
</script>

<section on:click={handleClick}>
	<div class="container" bind:this={divEl}>
		<div class="header">
			<h2>{title}</h2>
			<button on:click={() => dispatch('close')}>
				<img src="/close.svg" alt="close">
			</button>
		</div>
		<div class="content">
			<slot />
		</div>
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

		background: #0005;
		z-index: 2;
		backdrop-filter: blur(2px);
		animation: forwards .25s blur-in;
	}
	@keyframes blur-in {
		from {
			opacity: 0;
			backdrop-filter: blur(0px);
		}
		to {
			opacity: 1;
			backdrop-filter: blur(2px);
		}
	}

	.container {
		border-radius: 5px;
		background: rgb(234, 234, 234);
		min-width: 600px;
		min-height: 300px;
		animation: forwards 0.15s fade-in;
	}
	@keyframes fade-in {
		from {
			transform: scale(.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.header {
		display: grid;
		grid-template-columns: 1fr auto;
		padding: 30px;
	}
	.content {
		padding: 50px;
		padding-top: 0px;
	}
	button {
		border: none;
		background: none;
		cursor: pointer;
		display: flex;
		align-items: center;
	}
	button img {
		height: 16px;
	}
</style>
