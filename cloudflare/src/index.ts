import { getAllLinks, getLink, updateLink, deleteLink, createLink, Link } from "./utils";
import { Router } from './router';

export interface Env {
  REDIRECTS: KVNamespace;
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
