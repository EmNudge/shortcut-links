<script lang="ts">
	import Search from './Search.svelte';
    import { modalModeSt, searchSt, userSt } from '../stores';

    const handleNewLink = () => {
        $modalModeSt = { type: 'create' };
    };
</script>

<header>
    <div class="meta">
        <div class="brand">
            <h1>Redirects</h1>
            {#if $userSt}
                <div class="logged-in">
                    <h3>{$userSt.name}</h3>
                    <button>Log Out</button>
                </div>
            {:else}
                <a href="http://localhost:8787/_oauth">Login With Github</a>
            {/if}
        </div>
        {#if $userSt}
            <button class="new-link" on:click={handleNewLink}>New Link</button>
        {:else}
            <div />
        {/if}
    </div>
    <br />
    <Search bind:value={$searchSt} />
</header>

<style>
    header {
        margin: 0 auto;
        max-width: 800px;
        padding: 0 10px;

		position: sticky;
        top: 0;
        z-index: 2;
        background: var(--bg);
	}
    .brand {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

	.meta {
		display: flex;
		justify-content: space-between;
		padding-top: clamp(20px, 5vw, 40px);
	}
    .new-link {
        padding: 20px;
        box-shadow: var(--box-shadow);
        border: none;
        background: white;
        border-radius: 5px;
        cursor: pointer;
    }
    .logged-in {
        display: flex;
        align-items: center;
        gap: 10px;
    }
</style>