<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let name: string;
	export let url: string;
</script>

<section>
	<div class="text">
		<h2>{name}</h2>
		<h3>
			<a href={url}>{url}</a>
		</h3>
	</div>

	<div class="icons">
		<button on:click={() => dispatch('edit')}>
			<img src="/edit.svg" alt="edit" />
		</button>
		<button on:click={() => dispatch('delete')}>
			<img src="/bin.svg" alt="delete" />
		</button>
	</div>
</section>

<style>
	section {
		background: white;
		border-radius: 15px;
		box-shadow: var(--box-shadow);
		padding: 20px 30px;
		margin: 20px 40px;

		display: flex;
		justify-content: space-between;
	}
	h2,
	h3 {
		margin: 0;
	}
	.text {
		display: grid;
		grid-gap: 10px;
	}
	.icons {
		display: flex;
		gap: 5px;
	}
	.icons button {
		background: none;
		border: none;
		opacity: 0.5;
		transition: 0.25s;
	}
	.icons button:hover {
		opacity: 1;
		cursor: pointer;
	}
</style>
