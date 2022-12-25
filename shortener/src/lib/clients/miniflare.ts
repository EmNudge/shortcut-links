import { Miniflare, Log, LogLevel } from 'miniflare';
import { dev } from '$app/environment';

export const fallBackPlatformToMiniFlareInDev = async (platform: App.Platform): Promise<App.Platform> => {
	if (!dev) return platform;

	if (platform) return platform;

	const mf = new Miniflare({
		log: new Log(LogLevel.INFO),
		kvPersist: './kv-data', // Use filebase or in memory store
		kvNamespaces: ['REDIRECTS_KV'], // Declare array with NameSpaces
		globalAsyncIO: true,
		globalTimers: true,
		globalRandom: true,

		script: `
		addEventListener("fetch", (event) => {
			event.waitUntil(Promise.resolve(event.request.url));
			event.respondWith(new Response(event.request.headers.get("X-Message")));
		});
		addEventListener("scheduled", (event) => {
			event.waitUntil(Promise.resolve(event.scheduledTime));
		});
		`
	});

	return { env: await mf.getBindings() as any };
};