<script lang="ts">
	import { workerURL } from '../../variables';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Base from './Base.svelte';
	import { linksSt, modalModeSt, type Link } from '../../stores';

	export let link: Link;

	const handleDelete = async () => {
		console.log(`delete link`, link);

		await fetch(new URL('delete/', workerURL), {
			method: 'POST',
			body: JSON.stringify({ ...link })
		});
		$modalModeSt = { type: 'closed' };

		const oldLink = link;
		linksSt.update((links) => {
			return links.filter((link) => link.name !== oldLink.name);
		});
	};
</script>

{#if link}
	<Base title="Delete Link?" on:close={() => dispatch('close')}>
		<div>
			<span>name</span>
			<h2>{link.name}</h2>
			<br>
			<span>url</span>
			<h2>{link.url}</h2>
		</div>
		<br>
		<br>
		<div>
			<button type="button" on:click={handleDelete}>Delete Link</button>
		</div>
	</Base>
{/if}

<style>
	div {
		display: grid;
		justify-content: center;
	}
	button {
		background: #c84848;
		color: white;
		padding: 10px 80px;
		cursor: pointer;
		box-shadow: var(--box-shadow);
		border: none;
		border-radius: 5px;
	}
</style>
