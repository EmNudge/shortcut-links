<script lang="ts">
	import LinkItem from './LinkItem.svelte';
	import autoAnimate from '@formkit/auto-animate';
	import { modalModeSt, type Link } from '../stores';
	import { page } from '$app/stores';

	export let links: Link[];
	export let search: string;

	$: searchText = search.toLowerCase();
	$: listData = links.filter(({ name, url }) =>
		[name, url].some((t) => t.toLowerCase().includes(searchText))
	);

	const handleInteract = (index: number, type: 'edit' | 'delete') => {
		const link = { ...links[index] };
		modalModeSt.set({ type, link });
	};

	// need to void the return of autoAnimate due to es-lint
	const anim = (el: HTMLElement) => void autoAnimate(el);
</script>

<div use:anim>
	{#each listData as { name, url, privileged }, i (name)}
		<LinkItem
			{name}
			{url}
			{privileged}
			on:edit={() => handleInteract(i, 'edit')}
			on:delete={() => handleInteract(i, 'delete')}
			isEditable={Boolean($page.data.session)}
		/>
	{/each}
</div>

<style>
	div {
		margin: 10px 30px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
