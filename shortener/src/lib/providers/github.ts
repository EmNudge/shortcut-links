import type { Provider } from "@auth/core/providers";
import type { Profile } from "@auth/core/types";
import { GITHUB_AUTH_ID, GITHUB_AUTH_SECRET } from "$env/static/private"
import GitHub from "@auth/core/providers/github";

const githubProvider = GitHub({ clientId: GITHUB_AUTH_ID, clientSecret: GITHUB_AUTH_SECRET });
githubProvider.userinfo = {
	url: "https://api.github.com/user",
	async request({ tokens }) {
		return fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`,
				'User-Agent': 'cloudflare-worker-links',
			},
		})
		.then(res => res.json())
	}
}

export default githubProvider as Provider<Profile>;