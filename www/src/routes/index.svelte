<script lang="ts">
	import Header from '../components/Header.svelte';
	import LinkList from '../components/LinkList.svelte';
	import { workerURL } from '../variables';
	import Modal from '../components/Modal/index.svelte';
	import { linksSt, searchSt, userSt } from '../stores';
	import { handleAuth } from '../utils/handleAuth';
	import { onMount } from 'svelte';

	const linksFetch = fetch(workerURL, { credentials: 'include' }).then(res => res.json())
	linksFetch.then(({ user, data }) => {
		linksSt.set(data);
		userSt.set(user);
	});

	onMount(handleAuth);
</script>

<Modal />

<Header />

<br />

<main>
	{#await linksFetch}
		<h3>Loading...</h3>
	{:then}
		<LinkList links={$linksSt} search={$searchSt} />
	{:catch}
		<h3 style="color: red;">Error loading links</h3>
	{/await}
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
