import { getAllLinks, getLink, updateLink, deleteLink, createLink, Link } from './utils';
import { Router } from './router';

export interface Env {
  REDIRECTS: KVNamespace;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

const router = new Router(true);

router.get('/', async (_request, env) => {
  const links = await getAllLinks(env.REDIRECTS);

  return new Response(JSON.stringify(links), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
});

// Github OAuth
router.get('/_oauth', async (_request, env) => {
  return Response.redirect(`https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}`, 302);
});
router.post('/_oauth', async (request, env) => {
  const { code } = await request.json();

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
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code
      }),
    }
  );

  if (!response.ok) return new Response('error', { status: 500 });

  return new Response(await response.text(), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'type': 'application/json',
    },
  });
})

router.get('/:name', (_request, env, groups) => {
  return getLink(env.REDIRECTS, groups.name)
});

router.post('/:name', async (request, env, groups) => {
  const link = await request.json() as { url: string };
  return createLink(env.REDIRECTS, groups.name, link.url);
});

router.put('/:name', async (request, env, groups) => {
  return updateLink(env.REDIRECTS, groups.name, await request.json() as Link);
});

router.delete('/:name', async (_request, env, groups) => {
  return deleteLink(env.REDIRECTS, groups.name);
});

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    return router.process(request, env);
  }
}
