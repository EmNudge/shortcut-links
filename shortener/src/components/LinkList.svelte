<script lang="ts">
	import LinkItem from './LinkItem.svelte';
	import autoAnimate from '@formkit/auto-animate';
	import type { Link, Visbility } from '../stores';
	import { page } from '$app/stores';
	import { showModal } from '$lib/modal';

	export let links: Link[];
	export let search: string;
	export let title: string;
	export let description: string;
	export let defaultVisibility: Visbility;

	$: searchText = search.toLowerCase();
	$: listData = links.filter(({ name, url }) =>
		[name, url].some((t) => t.toLowerCase().includes(searchText))
	);

	// need to void the return of autoAnimate due to es-lint
	const anim = (el: HTMLElement) => void autoAnimate(el);
</script>

<section use:anim>
	<header>
        <h2>{title}</h2>
		{#if $page.data.session?.user}
			<div class="buttons">
				<button>
					<div class="info-block">{description}</div>
					<img src="/info.svg" alt="info">
				</button>
				<button on:click={() => showModal({ type: 'create', defaultVisibility })}>
					<img src="/plus.svg" alt="add link">
				</button>
			</div>
		{/if}
    </header>

	{#each listData as { name, url }, i (name)}
		<LinkItem
			{name}
			{url}
			on:edit={() => showModal({ type: 'edit', link: { ...links[i] } })}
			on:delete={() => showModal({ type: 'delete', link: { ...links[i] } })}
			isEditable={Boolean($page.data.session)}
		/>
	{:else}
		<div class="empty-section"> nothing to see here </div>
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
		padding: 3rem 2rem;
	}
	.empty-section {
		opacity: .5;
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
		height: 1.25rem;
		opacity: .5;
	}
	.info-block {
		position: absolute;
		width: 15rem;
		transform: translate(-50%, calc(-100% - 1rem));
		background: #ECEEF2;
		border-radius: 4px;
		padding: .5rem;
		border: 1px solid white;

		visibility: hidden;
		opacity: 0;
		transition: opacity .25s;
	}
	button:hover .info-block {
		visibility: visible;
		opacity: 1;
	}

	@media screen and (max-width: 550px) {
		section {
			margin: 1rem;
			padding: 2rem 1rem;
		}
	}
</style>
