<script lang="ts">
	import LinkItem from './LinkItem.svelte';
	import autoAnimate from '@formkit/auto-animate';
	import type { Link, Visbility } from '../stores';
	import { page } from '$app/stores';
	import { showModal } from '$lib/modal';
	import Popup from './Popup.svelte';

	export let links: Link[];
	export let search: string;
	export let title: string | undefined;
	export let description: string;
	export let defaultVisibility: Visbility;

	$: searchText = search.toLowerCase();
	$: filteredListData = links.filter(({ name, url }) =>
		[name, url].some((t) => t.toLowerCase().includes(searchText))
	);
	$: listData = ((links) => {
		const categorizedLinks = links.map((link) => [link.category ?? '', link] as const);
		categorizedLinks.sort((a, b) => a[0].localeCompare(b[0]));

		const categories = new Map<string, Link[]>();
		for (const [category, link] of categorizedLinks) {
			const arr = categories.get(category) ?? [];
			arr.push(link);
			categories.set(category, arr);
		}
		return [...categories];
	})(filteredListData);

	// need to void the return of autoAnimate due to es-lint
	const anim = (el: HTMLElement) => void autoAnimate(el);
</script>

<section use:anim class:with-title={title}>
	<header>
		{#if title}
			<h2>{title}</h2>
		{/if}
		{#if $page.data.session?.user}
			<div class="buttons">
				<button class="popup-container">
					<Popup content={description} />
					<img src="/info.svg" alt="info" />
				</button>
				<button on:click={() => showModal({ type: 'create', defaultVisibility })}>
					<img src="/plus.svg" alt="add link" />
				</button>
			</div>
		{/if}
	</header>

	{#each listData as [category, links] (category)}
		{#if category}
			<dl>
				<dt>{category}</dt>
				<dd>
					{#each links as link (link.name)}
						<LinkItem
							name={link.name}
							url={link.url}
							description={link.description}
							on:edit={() => showModal({ type: 'edit', link: { ...link } })}
							on:delete={() => showModal({ type: 'delete', link: { ...link } })}
							isEditable={Boolean($page.data.session)}
						/>
					{/each}
				</dd>
			</dl>
		{:else}
			{#each links as link (link.name)}
				<LinkItem
					name={link.name}
					url={link.url}
					description={link.description}
					on:edit={() => showModal({ type: 'edit', link: { ...link } })}
					on:delete={() => showModal({ type: 'delete', link: { ...link } })}
					isEditable={Boolean($page.data.session)}
				/>
			{/each}
		{/if}
	{:else}
		<div class="empty-section">nothing to see here</div>
	{/each}
</section>

<style>
	section {
		margin: 10px 30px;
		display: flex;
		flex-direction: column;
		gap: 20px;

		background: white;
		border-radius: 1rem;
		padding: 2rem;
	}
	section.with-title {
		padding: 3rem 2rem;
	}
	.empty-section {
		opacity: 0.5;
	}
	header {
		display: flex;
		justify-content: space-between;
	}

	.buttons button {
		background: none;
		border: none;
		cursor: pointer;
	}
	.buttons button img {
		filter: brightness(0%);
		height: 1.25rem;
		opacity: 0.5;
	}

	dt {
		font-weight: bold;
		opacity: 0.75;
	}
	dd {
		display: grid;
		gap: 1rem;
		margin: 1rem 0;
		border-left: 2px solid rgb(106, 131, 211, 0.15);
		padding-left: 0.5rem;
	}

	@media screen and (max-width: 550px) {
		section {
			margin: 1rem;
			padding: 2rem 1rem;
		}
	}
</style>
