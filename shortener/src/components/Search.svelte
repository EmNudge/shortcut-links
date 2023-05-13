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

		padding: .75rem 1rem;
		border-radius: .5rem;
	}

	input {
		font-size: 1.25rem;
		width: 100%;
		border: none;
		outline: none;
		background: none;
	}
</style>
