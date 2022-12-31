<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Base from './Base.svelte';
	import { linksSt, modalModeSt, type Link } from '../../stores';

	export let link: Link = { name: '', url: '', privileged: false };

	let { name, url, privileged } = link;
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
		const newLink = { url: newUrl.toString(), name, privileged };

		if (isUpdate) {
			await fetch('/api/update-link', {
				method: 'PUT',
				body: JSON.stringify({ ...newLink, oldName: oldLink.name }),
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

	$: isButtonDisabled = name === link.name && url === link.url && privileged === Boolean(link.privileged);
</script>

{#if link}
	<Base title="{link.name ? 'Edit' : 'New'} Link" on:close={() => dispatch('close')}>
		<form on:submit|preventDefault={handleSubmit} id="link-form">
			<label>
				<span>Name</span>
				<input type="text" placeholder="name..." bind:value={name} />
			</label>
			<label>
				<span>URL</span>
				<input type="text" placeholder="url..." bind:value={url} />
			</label>
			<label>
				<span>Protected</span>
				<input type="checkbox" bind:checked={privileged}>
			</label>
		</form>
		<div slot="footer">
			<button type="submit" form="link-form" disabled={isButtonDisabled}>Update Link</button>
			<div class="error">
				{error}
			</div>
		</div>
	</Base>
{/if}

<style>
	form {
		display: grid;
		grid-gap: 10px;
	}
	label {
		display: grid;
		justify-items: flex-start;
		grid-gap: 10px;
		margin-bottom: 10px;
	}
	input {
		border: 1px solid #e2e2e2;
    font-size: 1.25rem;
    padding: 10px;
    border-radius: 7px;
	}
	button {
		background: #c8f3ce;
		border: 1px solid rgb(90, 239, 90);
		padding: 10px 80px;
	}
	button:disabled {
		cursor: auto;
	}
	.error {
		color: red;
		text-align: center;
	}
</style>
