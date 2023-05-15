<script lang="ts">
	import { linksSt, modalModeSt, type Link, type Visbility } from '../../stores';
	import LinkModalBase from './LinkModalBase.svelte';

	export let link: Link;

	const visibility: Visbility = link.hidden ? 'unlisted' : link.privileged ? 'private' : 'public';
	const fixedLink: Link = { ...link, visibility };

	const handleSubmit = async (e: Event & { detail: Link }) => {
		const oldLink = link;
		const newLink = e.detail;

		await fetch('/api/update-link', {
			method: 'PUT',
			body: JSON.stringify({ ...newLink, oldName: oldLink.name })
		});
		$modalModeSt = { type: 'closed' };

		linksSt.update((links) => {
			const newLinks = links.filter((link) => link.name !== oldLink.name);
			newLinks.push(newLink);
			return newLinks;
		});
	};
</script>

{#if link}
	<LinkModalBase
		title="Edit Link"
		on:submit={handleSubmit}
		on:close
		link={fixedLink}
		submitButtonText="Update Link"
	/>
{/if}
