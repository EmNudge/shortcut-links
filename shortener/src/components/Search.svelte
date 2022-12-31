<script lang="ts">
	export let value: string = '';
</script>

<div>
	<input type="text" bind:value placeholder="Search..." />
	<img src="/search.svg" alt="search" />
</div>

<style>
	div {
		display: flex;
		border: none;
		background: white;
		max-width: 100%;
		width: 800px;

		padding: 20px;
		margin-top: 20px;
		border-radius: 5px;
	}

	input {
		width: 100%;
		font-size: 1.5rem;
		border: none;
		outline: none;
	}
</style>
