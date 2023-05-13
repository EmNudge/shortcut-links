<script lang="ts">
	export let value: string = '';
</script>

<label>
	<input type="text" bind:value placeholder="Search..." />
	<img src="/search.svg" alt="search" />
</label>

<style>
	label {
		display: flex;
		border: none;
		background: var(--bg);
		max-width: 500px;
		width: 1000px;

		padding: 1rem 2rem;
		border-radius: 1rem;
	}

	input {
		width: 100%;
		font-size: 1.5rem;
		border: none;
		outline: none;
		background: none;
	}
</style>
