<script lang="ts">
	import Search from './Search.svelte';
    import { modalModeSt, searchSt, userSt } from '../stores';
    import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Profile from './Profile.svelte';

    const handleNewLink = () => {
        $modalModeSt = { type: 'create' };
    };

    onMount(() => {
        console.log($page.data)
    });
    const { session } = $page.data;

</script>

<header>
    <div class="meta">
        <div class="brand">
            <h1>Redirects</h1>
            {#if $userSt}
                <button class="new-link" on:click={handleNewLink}>New Link</button>
            {/if}
        </div>
        <div class="auth">
            {#if session?.user}
                <Profile user={session.user} />
                <a href="/auth/signout">
                    <span>Sign Out</span>
                </a>
            {:else}
                <span>Want to edit links?</span>
                <a href="/auth/signin">
                    <span>Sign In</span>
                </a>
            {/if}
        </div>
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

    .auth {
        display: grid;
        grid-gap: 10px;
        align-content: center;
    }
    .auth a {
        box-shadow: -1px 1px 2px 0px #000a;
        background: white;
        padding: 2px 8px;
        border-radius: 5px;
        color: black;
        text-align: center;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>