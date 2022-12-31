<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Base from './Base.svelte';
	import { linksSt, modalModeSt, type Link } from '../../stores';

	export let link: Link;

	const handleDelete = async () => {
		console.log(`delete link`, link);

		await fetch('/api/update-link', { 
			method: 'DELETE',
			body: JSON.stringify({ name: link.name })
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
		<dl>
			<dt>Name</dt>
			<dd>{link.name}</dd>
	
			<dt>URL</dt>
			<dd>{link.url}</dd>
		</dl>
		<div slot="footer" >
			<button type="button" on:click={handleDelete}>Delete Link</button>
		</div>
	</Base>
{/if}

<style>
	dl {
		margin-bottom: 20px;
	}
	dt {
		font-weight: 700;
	}
	dd {
		padding: 10px;
	}
	button {
		background: #ffaaaa;
		border: 1px solid red;
		color: rgb(95, 0, 0);
		padding: 10px 80px;
	}
</style>
