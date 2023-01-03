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
	<div class="top-row">
		<h2>{name}</h2>
		<div class="icons">
			{#if isEditable}
				<button on:click={() => dispatch('edit')}>
					<img src="/edit.svg" alt="edit" />
				</button>
				<button on:click={() => dispatch('delete')}>
					<img src="/bin.svg" alt="delete" />
				</button>
			{/if}
		</div>
	</div>
	<h3>
		<a href={url}>{url}</a>
	</h3>
</section>

<style>
	section {
		background: white;
		border-radius: 15px;
		padding: 20px 30px;
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
	h3 {
		font-weight: 200;
		font-size: 1rem;
	}
	.top-row {
		display: flex;
		justify-content: space-between;
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
