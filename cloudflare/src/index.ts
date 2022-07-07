import { Router } from './router';
import { getAccessTokenCORSResponse, getAllLinksResponse, getCreateNewLinkResponse, getDeleteLinkResponse, getLinkResponse, getLoginRedirectResponse, getLogoutResponse, getUpdateLinkResponse } from './routes';

export interface Env {
  REDIRECTS: KVNamespace;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_USERS: string;
  ALLOWED_ORIGINS: string;
}

const router = new Router();

// enable CORS
router.options('*', async (request, _env) => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') ?? '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      // 'Access-Control-Max-Age': '86400', // cache this for 1 day
    },
    status: 204,
  });
});

router.get('/', getAllLinksResponse);

// Github OAuth
router.get('/_oauth', getLoginRedirectResponse);
router.post('/_oauth', getAccessTokenCORSResponse);
router.get('/_logout', getLogoutResponse);

router.get('/:name', getLinkResponse);

router.post('/:name', getCreateNewLinkResponse);
router.put('/:name', getUpdateLinkResponse);
router.delete('/:name', getDeleteLinkResponse);

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    return router.process(request, env);
  }
}
