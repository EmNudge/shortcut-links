<script lang="ts">
	import { workerURL } from '../../variables';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Base from './Base.svelte';
	import { linksSt, modalModeSt, type Link } from '../../stores';

	export let link: Link = { name: '', url: '' };

	let { name, url } = link;
	let error = '';

	const parsedUrl = (url: string) => {
		try {
			return new URL(url);
		} catch {
			try {
				return new URL('https://' + url);
			} catch {
				return null;
			}
		}
	}

	const handleSubmit = async () => {
		const newUrl = parsedUrl(url);
		error = newUrl ? '' : 'invalid URL';
		if (error || !newUrl) return;
		
		const oldLink = link;
		const newLink = { url: newUrl.toString(), name };
		console.log(`setting "${name}" to`, newLink);

		await fetch(new URL(`set/${name}`, workerURL), {
			method: 'POST',
			body: JSON.stringify(newLink)
		});
		$modalModeSt = { type: 'closed' };

		linksSt.update(links => {
			const newLinks = links.filter(link => link.name !== oldLink.name);
			newLinks.push(newLink);
			return newLinks;
		})
	};
</script>

{#if link}
	<Base on:close={() => dispatch('close')}>
		<h1>{link ? 'New' : 'Edit'} Link</h1>
		<br />
		<form on:submit|preventDefault={handleSubmit}>
			<input type="text" placeholder="name..." bind:value={name} />
			<input type="text" placeholder="url..." bind:value={url} />
			<button type="submit">Update Link</button>
			<div class="error">
				{error}
			</div>
		</form>
	</Base>
{/if}

<style>
	form {
		display: grid;
		grid-gap: 10px;
	}
	input {
		box-shadow: var(--box-shadow);
		border: none;
		font-size: 1.25rem;
		padding: 10px;
		border-radius: 5px;
	}
	button {
		background: white;
		border: 1px solid #0005;
		padding: 10px;
		cursor: pointer;
		box-shadow: var(--box-shadow);
	}
	.error {
		color: red;
		text-align: center;
	}
</style>
