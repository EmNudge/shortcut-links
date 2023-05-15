<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import Base from './Base.svelte';
</script>

<Base title="Log Out?" on:close={() => dispatch('close')}>
	<form action="/auth/signout" method="POST">
		<button type="submit">Sign Out</button>
	</form>
</Base>

<style>
	button {
		font-size: 1rem;
		padding: 0.5rem 2rem;
	}
</style>
