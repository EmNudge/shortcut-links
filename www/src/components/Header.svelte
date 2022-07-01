<script lang="ts">
	import Search from './Search.svelte';
    import { modalModeSt, searchSt } from '../stores';

    const handleNewLink = () => {
        $modalModeSt = { type: 'create' };
    };
</script>

<header>
    <div class="meta">
        <h1>Redirects</h1>
        <button on:click={handleNewLink}>New Link</button>
    </div>
    <br />
    <Search bind:value={$searchSt} />
</header>

<style>
    header {
        margin: 0 auto;
        max-width: 800px;

		position: sticky;
        top: 0;
        z-index: 2;
        background: var(--bg);
	}

	.meta {
		display: flex;
		justify-content: space-between;
		padding-top: 40px;
	}
</style>