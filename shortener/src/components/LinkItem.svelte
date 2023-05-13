<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let name: string;
	export let url: string;
	export let privileged: boolean | undefined;
	export let hidden: boolean | undefined;

	export let isEditable = false;
</script>

<section class:privileged class:hidden>
	<div class="data">
		<h2>{name}</h2>
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
		background: #F4F7FE;
		border-radius: 15px;
		padding: 1rem 2rem;
		display: grid;
		grid-template-columns: 1fr auto;
	}
	.privileged {
		border: 1px solid orange;
	}
	.hidden {
		box-shadow: inset 0 0 8px #000a;
	}
	.hidden h2 {
		opacity: .8;
	}
	h2,
	h3 {
		margin: 0;
	}
	h2 {
		opacity: .8;
	}
	h3 {
		font-weight: 200;
		font-size: 1rem;
		margin-top: 10px;
		word-break: break-all;
	}
	h3 a {
		color: #8EBBFF;
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
		transform: scale(.9);
	}
</style>
