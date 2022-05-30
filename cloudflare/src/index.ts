export interface Env {
  REDIRECTS: KVNamespace;
}

async function updateLink(redirects: KVNamespace, name: string, request: Request) {
  const { url } = await request.json();
  await redirects.put(name, url);

  return new Response(`successfully set "${name}" to "${url}"`);
}

async function getLink(redirects: KVNamespace, name: string) {
  const url = await redirects.get(name);
  if (!url) return new Response(`no redirect for "${name}"`, { status: 404 });

  return Response.redirect(url, 307);
}

async function getAllLinks(redirects: KVNamespace) {
  const { keys } = await redirects.list();
  const names = keys.map(({ name }) => name);
  const values = await Promise.all(names.map((name) => redirects.get(name)))
  const links = names.map((name, i) => ({ name, url: values[i] }))

  return new Response(JSON.stringify(links));
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const reqUrl = new URL(request.url);
    if (request.method === 'POST') {
      const match = reqUrl.pathname.match(/^\/set\/(.+)/); 
      if (!match) return new Response("malformed data", { status: 400 });
  
      return updateLink(env.REDIRECTS, match[1], request);
    } 
    
    if (request.method === 'GET') {
      if (reqUrl.pathname === '/') return getAllLinks(env.REDIRECTS);

      const match = reqUrl.pathname.match(/^\/get\/(.+)/);
      if (!match) return new Response("malformed data: " + reqUrl.pathname, { status: 400 });
  
      return getLink(env.REDIRECTS, match[1])
    }
  
    return new Response("request type not supported", { status: 400 });
  },
};
