<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Popup from './Popup.svelte';
	const dispatch = createEventDispatcher();

	export let name: string;
	export let url: string;
	export let description: string | undefined;

	export let isEditable = false;
</script>

<section>
	<div class="data">
		<h2>
			<span>{name}</span>
			{#if description}
				<span class="popup-container">
					<Popup content={description} />
					<img src="/info.svg" alt="info" />
				</span>
			{/if}
		</h2>
		<h3>
			<a href={url}>{url}</a>
		</h3>
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
		margin-top: 0.25rem;
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

	h2 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.popup-container img {
		height: 1rem;
		opacity: 0.9;
	}
</style>
