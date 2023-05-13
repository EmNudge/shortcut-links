<script>
	import { modalModeSt } from '../../stores';

	import EditCreateModal from './EditCreateModal.svelte';
	import DeleteModal from './DeleteModal.svelte';
	import AuthModal from './AuthModal.svelte';

	$: modalMode = $modalModeSt;

	const handleCloseModal = () => {
		$modalModeSt = { type: 'closed' };
	};
</script>

{#if modalMode.type === 'edit'}
	<EditCreateModal link={modalMode.link} on:close={handleCloseModal} />
{:else if modalMode.type === 'delete'}
	<DeleteModal link={modalMode.link} on:close={handleCloseModal} />
{:else if modalMode.type === 'create'}
	<EditCreateModal on:close={handleCloseModal} />
{:else if modalMode.type === 'auth'}
	<AuthModal on:close={handleCloseModal} />
{/if}
