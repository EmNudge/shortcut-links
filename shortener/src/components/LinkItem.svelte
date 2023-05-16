<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let name: string;
	export let url: string;
	export let description: string | undefined;

	export let isEditable = false;
</script>

<section>
	<div class="data">
		<h2>{name}</h2>
		<h3>
			<a href={url}>{url}</a>
		</h3>
		{#if description}<hr />{/if}
	</div>
	<div class="icons">
		{#if isEditable}
			<button on:click={() => navigator.clipboard.writeText(url)}>
				<img src="/copy.svg" alt="copy" />
			</button>
			<button on:click={() => dispatch('edit')}>
				<img src="/edit.svg" alt="edit" />
			</button>
			<button on:click={() => dispatch('delete')}>
				<img src="/bin.svg" alt="delete" />
			</button>
		{/if}
	</div>
	{#if description}
		<div class="description">
			{description}
		</div>
	{/if}
</section>

<style>
	section {
		background: #f4f7fe;
		border-radius: 15px;
		padding: 1rem 2rem;
		display: grid;
		grid-template-columns: 1fr auto;
	}
	h2,
	h3 {
		margin: 0;
	}
	h2 {
		opacity: 0.8;
	}
	h3 {
		font-weight: 200;
		font-size: 1rem;
		margin-top: 10px;
		word-break: break-all;
	}
	h3 a {
		color: #8ebbff;
	}
	.icons {
		display: flex;
		gap: 5px;
	}
	.icons button {
		background: none;
		border: none;
		box-shadow: none;
		transition: 0.25s;
		cursor: pointer;
	}
	.icons button:active {
		transform: scale(0.9);
	}

	@media screen and (max-width: 350px) {
		section {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			justify-items: center;
		}
	}
	hr {
		opacity: 0.15;
		margin-top: 1rem;
	}
	.description {
		padding: 1rem;
		opacity: 0.8;
	}
</style>
