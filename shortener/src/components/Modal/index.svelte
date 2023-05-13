<script>
	import { modalModeSt } from '../../stores';

	import EditModal from './EditModal.svelte';
	import CreateModal from './CreateModal.svelte';
	import DeleteModal from './DeleteModal.svelte';
	import AuthModal from './AuthModal.svelte';
	import { closeModal } from '$lib/modal';

	$: modalMode = $modalModeSt;
</script>

{#if modalMode.type === 'edit'}
	<EditModal link={modalMode.link} on:close={closeModal} />
{:else if modalMode.type === 'delete'}
	<DeleteModal link={modalMode.link} on:close={closeModal} />
{:else if modalMode.type === 'create'}
	<CreateModal defaultVisibility={modalMode.defaultVisibility} on:close={closeModal} />
{:else if modalMode.type === 'auth'}
	<AuthModal on:close={closeModal} />
{/if}
