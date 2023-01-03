<script lang="ts">
	import Header from '../components/Header.svelte';
	import LinkList from '../components/LinkList.svelte';
	import Modal from '../components/Modal/index.svelte';
	import Toast from '../components/Toast.svelte';
	import { linksSt, searchSt, type Link } from '../stores';
	import { onMount } from 'svelte';

  export let data: { links: Link[] };
	onMount(() => linksSt.set(data.links));
</script>

<Modal />
<Toast />

<Header />

<br />

<main>
  <LinkList links={$linksSt} search={$searchSt} />
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
