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
		linksSt.update(links => {
			return links.filter(link => link.name !== oldLink.name);
		})
	};
</script>

{#if link}
	<Base on:close={() => dispatch('close')}>
		<h1>Delete Link?</h1>

		<div>
			<h2>
				name: <strong>{link.name}</strong>
			</h2>
			<h2>
				url: <strong>{link.url}</strong>
			</h2>
		</div>
		<div>
			<button type="button" on:click={handleDelete}>Delete Link</button>
		</div>
	</Base>
{/if}

<style>
	div {
		padding: 10px;
		margin: 20px 0;
		display: grid;
		justify-content: center;
	}
	button {
		background: #c84848;
		color: white;
		padding: 10px;
		cursor: pointer;
		box-shadow: var(--box-shadow);
	}
</style>
