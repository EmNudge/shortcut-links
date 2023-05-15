<script lang="ts">
	import Search from './Search.svelte';
	import { searchSt } from '../stores';
	import { page } from '$app/stores';
	import Profile from './Profile.svelte';

	const { session } = $page.data;
</script>

<header>
	<div class="meta">
		<Search bind:value={$searchSt} />
		<div class="auth">
			{#if session?.user}
				<Profile user={session.user} />
			{:else}
				<span>Want to edit links?</span>
				<form action="/auth/signin/github" method="POST">
					<input type="hidden" name="callbackUrl" value={$page.url.origin} />
					<button type="submit">Sign In</button>
				</form>
			{/if}
		</div>
	</div>
</header>

<style>
	header {
		margin: 0 auto;
		padding: 1rem;

		position: sticky;
		top: 0;
		z-index: 2;
		background: white;

		display: flex;
		justify-content: center;
		align-items: center;

		box-shadow: 0px 4px 4px #0001;
	}
	.meta {
		display: grid;
		justify-content: space-between;
		align-items: center;
		grid-template-columns: 1fr auto;
		gap: 2rem;
		max-width: 800px;
		width: 100%;
	}

	@media screen and (max-width: 850px) {
		.meta {
			grid-template-columns: 1fr 5rem;
		}
	}

	.auth {
		display: grid;
		grid-gap: 10px;
		align-content: center;
	}
	.auth button {
		width: 100%;
		padding: 0.25rem 2rem;
	}
</style>
