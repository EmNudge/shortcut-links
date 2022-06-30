import { getAllLinks, getLink, updateLink } from "./utils";

export interface Env {
  REDIRECTS: KVNamespace;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const reqUrl = new URL(request.url);

    if (request.method === 'POST') {
      // update a link with /set/[name]
      const match = reqUrl.pathname.match(/^\/set(?:\/(.+))?/); 
      if (!match) return new Response("malformed data", { status: 400 });
  
      return updateLink(env.REDIRECTS, match[1], request);
    } 
    
    if (request.method === 'GET') {
      // return all links
      if (reqUrl.pathname === '/') {
        const links = await getAllLinks(env.REDIRECTS);
        return new Response(JSON.stringify(links), {
          headers: {
            'Content-Type': 'text/javascript',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // redirect to specific URL with /get/[name]
      const match = reqUrl.pathname.match(/^\/get\/(.+)/);
      if (!match) return new Response("malformed data: " + reqUrl.pathname, { status: 400 });
  
      return getLink(env.REDIRECTS, match[1])
    }
  
    return new Response("request type not supported", { status: 400 });
  },
};
