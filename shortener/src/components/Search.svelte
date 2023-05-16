<script lang="ts">
	import { showModal } from "$lib/modal";
	import { onMount } from "svelte";

	export let value: string = '';

	let searchEl: HTMLInputElement;
	onMount(() => {
		const handleType = (e: KeyboardEvent) => {
			if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) return;
			if (e.key === 'N') {
				showModal({ type: 'create', defaultVisibility: 'public' });
				e.preventDefault();
				return;
			}
			if (/^[a-zA-Z]$/.test(e.key)) {
				searchEl.focus();
				return;
			}
		};
		document.addEventListener('keydown', handleType);
	})
</script>

<label>
	<input type="text" bind:value placeholder="Search..." bind:this={searchEl} />
	<img src="/search.svg" alt="search" />
</label>

<style>
	label {
		display: flex;
		border: none;
		background: var(--bg);

		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
	}

	input {
		font-size: 1.25rem;
		width: 100%;
		border: none;
		outline: none;
		background: none;
	}
</style>
