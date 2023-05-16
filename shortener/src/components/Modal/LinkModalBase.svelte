<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Base from './Base.svelte';
	import { modalModeSt, type Link, linksSt } from '../../stores';
	import { INVALID_LINK_NAMES } from '$lib/links';

	export let link: Link;
	export let title: string;
	export let submitButtonText: string;

	let { name, url, visibility, category, description } = link;
	visibility ??= $modalModeSt.type === 'create' ? $modalModeSt.defaultVisibility : undefined;
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
	};

	const handleSubmit = async () => {
		const linkName = name.trim().toLowerCase();
		if (INVALID_LINK_NAMES.has(linkName)) {
			error = 'reserved link name';
			return;
		} else if (!/^(\w|-)+$/i.test(linkName)) {
			error = 'invalid characters in name';
			return;
		}

		const newUrl = parsedUrl(url);
		if (!newUrl) {
			error = 'invalid URL';
			return;
		}

		dispatch('submit', { name, url: newUrl.toString(), visibility, category, description });
	};

	$: categories = [
		...$linksSt.reduce((categoriesSet, link) => {
			categoriesSet.add(link.category ?? '');
			return categoriesSet;
		}, new Set<string>())
	];

	$: isButtonDisabled =
		name === link.name &&
		url === link.url &&
		visibility === link.visibility &&
		description === link.description &&
		category === link.category;
</script>

{#if link}
	<Base {title} on:close={() => dispatch('close')}>
		<form on:submit|preventDefault={handleSubmit} id="link-form">
			<label>
				<span>Name</span>
				<input type="text" required placeholder="name..." bind:value={name} />
			</label>
			<label>
				<span>URL</span>
				<input type="text" required placeholder="url..." bind:value={url} />
			</label>
			<label>
				<span>Visbility</span>
				<select required bind:value={visibility}>
					{#each ['Public', 'Unlisted', 'Private'] as visibleState}
						<option value={visibleState.toLowerCase()}>{visibleState}</option>
					{/each}
				</select>
			</label>
			<label>
				<span class="optional">Cateogory</span>
				<input list="categories-list" type="text" placeholder="category..." bind:value={category} />
			</label>

			<datalist id="categories-list">
				{#each categories as cat}
					<option value={cat} />
				{/each}
			</datalist>

			<label>
				<span class="optional">Description</span>
				<textarea bind:value={description} />
			</label>
		</form>
		<div slot="footer">
			<button type="submit" form="link-form" disabled={isButtonDisabled}>{submitButtonText}</button>
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
		grid-gap: 0.25rem;
		margin-bottom: 10px;
	}
	label > span {
		font-size: 0.75rem;
		opacity: 0.8;
	}
	input {
		width: 400px;
	}
	textarea {
		width: 100%;
		height: 4rem;
		padding: 0.5rem;
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
	}
	select,
	input,
	button {
		border: 1px solid #aaa;
		padding: 0.25rem 0.75rem;
		border-radius: 0.25rem;
		font-size: 1rem;
	}
	button {
		padding: 0.5rem 2rem;
	}

	.optional:after {
		content: '- Optional';
		opacity: 0.5;
		margin-left: 0.5em;
		font-style: italic;
	}
	.error {
		color: red;
		text-align: center;
	}
</style>
