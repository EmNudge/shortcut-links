<script lang="ts">
	import { linksSt, modalModeSt, type Link, type Visbility } from '../../stores';
	import LinkModalBase from './LinkModalBase.svelte';

    export let defaultVisibility: Visbility;

	const handleSubmit = async (e: Event & { detail: Link }) => {
		const link = e.detail;

        await fetch('/api/update-link', {
            method: 'POST',
            body: JSON.stringify(link),
        });
		$modalModeSt = { type: 'closed' };

		linksSt.update((links) => [...links, link]);
	};
</script>

<LinkModalBase
    title="New Link"
    on:submit={handleSubmit}
    on:close
    link={{ name: '', url: '', visibility: defaultVisibility }}
    submitButtonText="Create Link"
/>