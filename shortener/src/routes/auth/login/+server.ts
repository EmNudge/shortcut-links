import { getPayload } from "$lib/getPayload";
import { CLIENT_ID, CLIENT_SECRET } from "$lib/variables";
import { json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
  const accessToken = cookies.get('gh-accesstoken');

  if (!accessToken) {
    throw redirect(307, `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`)
  }


  const res = await fetch('https://api.github.com/user', {
    headers: {
      'User-Agent': 'cloudflare-worker-links',
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${accessToken}`,
    }
  });
  const { login, name } = await res.json() as { login: string, name: string };
  return json({ login, name }, { status: 200 });
}

export const POST: RequestHandler = async ({ request }) => {
  const { access_code } = await getPayload(request, { access_code: 'string' });

  const response = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'cloudflare-worker-links',
        accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: access_code,
      }),
    }
  );

  const { access_token } = await response.json() as { access_token: string };

  return new Response(JSON.stringify({ access_token }), {
    status: 200,
    headers: {
      'Type': 'application/json',
      'Set-Cookie': `access_token=${access_token}; HttpOnly; Secure; SameSite=None`,
    },
  });
}