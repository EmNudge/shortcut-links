<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Base from './Base.svelte';
	import { modalModeSt, type Link } from '../../stores';
	import { INVALID_LINK_NAMES } from '$lib/links';
	
	export let link: Link;
    export let title: string;
    export let submitButtonText: string;
    
	let { name, url, visibility, category } = link;
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
	}

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
		
        dispatch('submit', { name, url: newUrl.toString(), visibility, category })
	};

    $: isButtonDisabled = name === link.name && url === link.url && visibility === link.visibility && category === link.category;
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
				<input type="text" placeholder="category..." bind:value={category} />
			</label>
		</form>
		<div slot="footer">
            <button type="submit" form="link-form" disabled={isButtonDisabled}
                >{submitButtonText}</button
            >
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
		grid-gap: .25rem;
		margin-bottom: 10px;
	}
	label > span {
		font-size: .75rem;
		opacity: .8;
	}
	input {
        width: 400px;
	}
    select, input, button {
        border: 1px solid #aaa;
        padding: 0.25rem .75rem;
        border-radius: 0.25rem;
        font-size: 1rem;
    }
    button {
        padding: .5rem 2rem;
    }
    
    .optional:after {
        content: '- Optional';
        opacity: .5;
        margin-left: .5em;
        font-style: italic;
    }
	.error {
		color: red;
		text-align: center;
	}
</style>
