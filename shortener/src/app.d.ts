/// <reference types="@sveltejs/adapter-cloudflare" />

declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	interface Platform {
		env?: {
			REDIRECTS_KV: KVNamespace;
		};
	}
}
