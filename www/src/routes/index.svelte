<script lang="ts">
	import Search from '../components/Search.svelte';
	import LinkList from '../components/LinkList.svelte';
	import { workerURL } from '../variables';
	import Modal from '../components/Modal/index.svelte';
	import { linksSt, modalModeSt } from '../stores';

	const linksFetch = fetch(workerURL).then((res) => res.json());
    linksFetch.then(data => linksSt.set(data));

	let search = '';

	const handleNewLink = () => {
		$modalModeSt = { type: 'create' };
	};
</script>

<Modal />

<div class="search-container">
	<div class="header">
		<h1>Redirects</h1>
		<button on:click={handleNewLink}>New Link</button>
	</div>
	<br />
	<Search bind:value={search} />
</div>

<br />

<main>
	{#await linksFetch}
		<h3>Loading...</h3>
	{:then}
		<LinkList links={$linksSt} {search} />
	{:catch}
		<h3 style="color: red;">Error loading links</h3>
	{/await}
</main>

<style>
	.header {
		display: flex;
		justify-content: space-between;
	}
	main {
		width: 800px;
		max-width: 100%;
		display: grid;
		height: 100%;
	}

	.search-container {
		position: sticky;
	}
</style>
