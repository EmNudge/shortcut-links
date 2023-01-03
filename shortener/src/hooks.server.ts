import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { SvelteKitAuth } from "@auth/sveltekit"
import githubProvider from '$lib/providers/github';
import { APPROVED_ADMINS } from "$env/static/private";
import type { Session } from "@auth/core/types";

const approvedAdmins = APPROVED_ADMINS.trim().split(/\s*,\s*/);

export const isPrivileged = (user: Session['user']) => {
  if (!user) return false;
  return approvedAdmins.includes(user?.name ?? '')
}

export const isPrivilegedSession = async (locals: App.Locals) => {
	const session = await locals.getSession();
	console.log({session})
  return isPrivileged(session?.user);
}

const authHandler = SvelteKitAuth({
	trustHost: true,
	callbacks: {
		signIn: ({ user }) => isPrivileged(user),
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