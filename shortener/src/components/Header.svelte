<script lang="ts">
	import Search from './Search.svelte';
    import { modalModeSt, searchSt } from '../stores';
    import { page } from '$app/stores';
	import Profile from './Profile.svelte';

    const handleNewLink = () => {
        $modalModeSt = { type: 'create' };
    };

    const { session } = $page.data;
</script>

<header>
    <div class="meta">
        <div class="brand">
            <h1>Redirects</h1>
            {#if session}
                <button on:click={handleNewLink}>New Link</button>
            {/if}
        </div>
        <div class="auth">
            {#if session?.user}
                <Profile user={session.user} />
                <form action="/auth/signout" method="POST">
                    <button type="submit">Sign Out</button>
                </form>
            {:else}
                <span>Want to edit links?</span>
                <form action="/auth/signin/github" method="POST">
                    <input type="hidden" name="callbackUrl" value={$page.url.origin}>
                    <button type="submit">Sign In</button>
                </form>
            {/if}
        </div>
    </div>
    <br />
    <Search bind:value={$searchSt} />
</header>

<style>
    h1 {
        font-size: 3em;
    }
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
    
    .auth {
        display: grid;
        grid-gap: 10px;
        align-content: center;
    }
    .auth button {
        width: 100%;
    }
</style>