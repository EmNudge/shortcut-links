<script lang="ts">
	import Search from './Search.svelte';
    import { searchSt } from '../stores';
    import { page } from '$app/stores';
	import Profile from './Profile.svelte';

    const { session } = $page.data;
</script>

<header>
    <div class="meta">
        <div class="brand">
            <h1>Rdrct</h1>
        </div>
        <Search bind:value={$searchSt} />
        <div class="auth">
            {#if session?.user}
                <Profile user={session.user} />
            {:else}
                <span>Want to edit links?</span>
                <form action="/auth/signin/github" method="POST">
                    <input type="hidden" name="callbackUrl" value={$page.url.origin}>
                    <button type="submit">Sign In</button>
                </form>
            {/if}
        </div>
    </div>
</header>

<style>
    h1 {
        font-size: 2.25rem;
        opacity: .8;
        font-weight: 200;
    }
    header {
        margin: 0 auto;
        padding: 2rem 1rem;

		position: sticky;
        top: 0;
        z-index: 2;
        background: white;

        display: flex;
        justify-content: center;
        align-items: center;
	}
    .brand {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

	.meta {
		display: flex;
		justify-content: space-between;
        align-items: center;
        gap: 2rem;
        width: 1200px;
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