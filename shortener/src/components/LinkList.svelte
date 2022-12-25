<script lang="ts">
	import LinkItem from './LinkItem.svelte';
	import autoAnimate from '@formkit/auto-animate';
	import { modalModeSt, type Link } from '../stores';

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
</script>

<div use:autoAnimate>
	{#each listData as { name, url }, i (name)}
		<LinkItem
			{name}
			{url}
			on:edit={() => handleInteract(i, 'edit')}
			on:delete={() => handleInteract(i, 'delete')}
		/>
	{/each}
</div>

<style>
	div {
		margin: 10px;
	}
</style>
