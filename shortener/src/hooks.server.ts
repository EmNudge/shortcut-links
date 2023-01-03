import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { SvelteKitAuth } from "@auth/sveltekit"
import { APPROVED_ADMINS } from "$env/static/private"
import githubProvider from '$lib/providers/github';

const approvedAdmins = APPROVED_ADMINS.trim().split(/\s*,\s*/);

const authHandler = SvelteKitAuth({
	trustHost: true,
	callbacks: {
		signIn({ user }) {
			return approvedAdmins.includes(user.name ?? '')
		}
	},
	providers: [
		githubProvider
	],
});

export const handle: Handle = async ({ event, resolve }) => {
	if (dev) {
		const { fallBackPlatformToMiniFlareInDev } = await import('./lib/clients/miniflare');
		event.platform = await fallBackPlatformToMiniFlareInDev(event.platform);
	}

	return authHandler({ event, resolve });
};