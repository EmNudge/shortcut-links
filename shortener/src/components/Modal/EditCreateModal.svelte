<script lang="ts">
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
		
		const isUpdate = Boolean(link.name);
		const oldLink = link;
		const newLink = { url: newUrl.toString(), name };
		console.log(`setting "${name}" to`, newLink);

		if (isUpdate) {
			await fetch('/api/update-link', {
				method: 'PUT',
				body: JSON.stringify(newLink),
			});
		} else {
			await fetch('/api/update-link', {
				method: 'POST',
				body: JSON.stringify(newLink),
			});
		}
		$modalModeSt = { type: 'closed' };

		linksSt.update(links => {
			const newLinks = links.filter(link => link.name !== oldLink.name);
			newLinks.push(newLink);
			return newLinks;
		})
	};
</script>

{#if link}
	<Base title="{link.name ? 'Edit' : 'New'} Link" on:close={() => dispatch('close')}>
		<form on:submit|preventDefault={handleSubmit}>
			<label>
				<span>Name</span>
				<input type="text" placeholder="name..." bind:value={name} />
			</label>
			<label>
				<span>URL</span>
				<input type="text" placeholder="url..." bind:value={url} />
			</label>
			<br>
			<br>
			<button type="submit" disabled={name === link.name && url == link.url}>Update Link</button>
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
	label {
		display: grid;
		grid-gap: 10px;
		margin-bottom: 10px;
	}
	input {
		box-shadow: var(--box-shadow);
		border: none;
		font-size: 1.25rem;
		padding: 10px;
		border-radius: 5px;
	}
	button {
		background: #8be799;
		border: none;
		border-radius: 5px;
		padding: 10px;
		cursor: pointer;
		box-shadow: var(--box-shadow);
	}
	button:disabled {
		cursor: auto;
	}
	.error {
		color: red;
		text-align: center;
	}
</style>
