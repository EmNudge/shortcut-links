<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let error: string | undefined;
	const ERROR_MESSAGES: Record<string, string> = {
		404: 'Cannot find link!'
	};

	const updateError = () => {
		const statusCode = new URLSearchParams(location.search).get('status');
		if (!statusCode) return;
		error = ERROR_MESSAGES[statusCode];
	};

	onMount(() => {
		document.addEventListener('pushstate', updateError);
		updateError();
		return () => document.removeEventListener('pushstate', updateError);
	});
</script>

{#if error}
	<div transition:fly={{ y: 80 }}>
		<button class="close-btn" on:click={() => (error = '')}>
			<span> + </span>
		</button>
		<span aria-live="assertive"> {error} </span>
	</div>
{/if}

<style>
	div {
		position: fixed;
		bottom: 40px;
		left: 50%;
		transform: translate(-50%);
		font-size: 1.25em;

		background: rgb(255, 165, 165);
		border: 1px solid red;
		padding: 40px;
		min-width: 400px;
		text-align: center;
		border-radius: 4px;
	}

	.close-btn {
		position: absolute;
		top: 10px;
		right: 10px;
	}
	.close-btn span {
		display: block;
		transform: rotate(45deg);
		font-size: 2em;
	}
</style>
