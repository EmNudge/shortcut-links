<script lang="ts">
	import { page } from '$app/stores';
	import Header from '../components/Header.svelte';
	import LinkList from '../components/LinkList.svelte';
	import Modal from '../components/Modal/index.svelte';
	import Toast from '../components/Toast.svelte';
	import { linksSt, searchSt, type Link } from '../stores';
	import { onMount } from 'svelte';

	export let data: { links: Link[] };
	onMount(() => linksSt.set(data.links));

	$: publicLinks = $linksSt.filter((link) => !link.privileged && !link.hidden);
	$: unlistedLinks = $linksSt.filter((link) => link.hidden);
	$: privilegedLinks = $linksSt.filter((link) => link.privileged);

	const { session } = $page.data;
	const isLoggedIn = Boolean(session?.user);

</script>

<Modal />
<Toast />

<Header />

<br />

<main>
	<LinkList
		links={publicLinks}
		search={$searchSt}
		defaultVisibility="public"
		title={isLoggedIn ? 'Public Links' : undefined}
		description="These links are viewable by anyone with this page's link"
	/>
	{#if isLoggedIn}
		<LinkList
			links={unlistedLinks}
			search={$searchSt}
			defaultVisibility="unlisted"
			title="Unlisted Links"
			description="These links will work for anyone, but not be visible on your page"
		/>
		<LinkList
			links={privilegedLinks}
			search={$searchSt}
			defaultVisibility="private"
			title="Private Links"
			description="These links will only work for your account and not be shown to anyone else"
		/>
	{/if}
</main>

<style>
	main {
		width: 800px;
		max-width: 100%;
		display: grid;
		height: 100%;
		margin: 0 auto;
	}
</style>
