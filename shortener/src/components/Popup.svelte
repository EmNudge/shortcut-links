<script lang="ts">
	export let content: string;
</script>

<div class="popup">{content}</div>

<style>
	:global(.popup-container) {
		position: relative;
	}

	.popup {
		--bg: #c6d9ff;

		position: absolute;
		width: max-content;
		max-width: 15rem;
		transform: translate(-50%, calc(-100% - 0.8rem));
		background: var(--bg);
		border-radius: 4px;
		padding: 0.5rem;
		border: 1px solid white;
		font-size: 0.8rem;
		font-weight: 200;
		text-align: center;

		visibility: hidden;
		opacity: 0;
		transition: opacity 0.25s;
	}

	.popup:after {
		content: '';
		border: 0.5rem solid transparent;
		border-top: 0.5rem solid var(--bg);

		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateY(calc(100% - 0.5px));
	}

	:global(.popup-container:hover .popup) {
		visibility: visible;
		opacity: 1;
	}
</style>
