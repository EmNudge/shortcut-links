import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from '@auth/core/providers/github';
import { GITHUB_AUTH_ID, GITHUB_AUTH_SECRET } from "$env/static/private"

const authHandler = SvelteKitAuth({
	providers: [
		GitHub({ clientId: GITHUB_AUTH_ID, clientSecret: GITHUB_AUTH_SECRET }) as any,
	]
});

export const handle: Handle = async ({ event, resolve }) => {
	if (dev) {
		const { fallBackPlatformToMiniFlareInDev } = await import('./lib/clients/miniflare');
		event.platform = await fallBackPlatformToMiniFlareInDev(event.platform);
	}

	return authHandler({ event, resolve });
};