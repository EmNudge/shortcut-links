import type { RouteFunc } from './router';
import { checkAuthorization, getAllLinks, getCredentialedHeaders, getUserAccessTokenResponse, Link, updateLink } from './utils';

export const getAllLinksResponse: RouteFunc = async (request, env) => {
  const credentialedHeaders = getCredentialedHeaders(request.headers, env.ALLOWED_ORIGINS.split(','));

  const user = await checkAuthorization(request, env);

  // get all links
  const data = await getAllLinks(env.REDIRECTS, user !== null);

  return new Response(JSON.stringify({ user, data }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...credentialedHeaders,
    },
  });
}

export const getLinkResponse: RouteFunc = async (request, env, groups) => {
  const { name } = groups;

  const url = await env.REDIRECTS.get(name);
  if (!url) return new Response(`no redirect for "${name}"`, { status: 404 });

  return Response.redirect(url, 307);
}

export const getCreateNewLinkResponse: RouteFunc = async (request, env, groups) => {
  const credentialedHeaders = getCredentialedHeaders(request.headers, env.ALLOWED_ORIGINS.split(','));
  if (!credentialedHeaders) return new Response('origin not allowed', { status: 401 });

  const login = await checkAuthorization(request, env);
  if (!login) return new Response('not authorized', { status: 401, headers: credentialedHeaders });

  const { name } = groups;
  const { url } = await request.json() as { url: string };

  await env.REDIRECTS.put(name, url);
  return new Response(`successfully created link "${name}" with URL "${url}"`, {
    headers: {
      'Content-Type': 'text/plain',
      ...credentialedHeaders,
    },
    status: 201,
  });
}

export const getUpdateLinkResponse: RouteFunc = async (request, env, groups) => {
  const credentialedHeaders = getCredentialedHeaders(request.headers, env.ALLOWED_ORIGINS.split(','));
  if (!credentialedHeaders) return new Response('origin not allowed', { status: 401 });

  const login = await checkAuthorization(request, env);
  if (!login) return new Response('not authorized', { status: 401, headers: credentialedHeaders });

  const { name, url } = await request.json() as Link;
  await updateLink(env.REDIRECTS, groups.name, { name, url });

  return new Response(`successfully set "${name}" to "${url}"`, {
    headers: {
      'Content-Type': 'text/plain',
      ...credentialedHeaders,
    },
    status: 200,
  });
}

export const getDeleteLinkResponse: RouteFunc = async (request, env, groups) => {
  const credentialedHeaders = getCredentialedHeaders(request.headers, env.ALLOWED_ORIGINS.split(','));
  if (!credentialedHeaders) return new Response('origin not allowed', { status: 401 });

  const login = await checkAuthorization(request, env);
  if (!login) return new Response('not authorized', { status: 401, headers: credentialedHeaders });

  const { name } = groups;
  await env.REDIRECTS.delete(name);

  return new Response(`successfully deleted "${name}"`, {
    headers: {
      'Content-Type': 'text/plain',
      ...credentialedHeaders,
    },
    status: 200,
  });
}

export const getLoginRedirectResponse: RouteFunc = async (_request, env) => {
  return Response.redirect(`https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}`, 302);
}

export const getAccessTokenCORSResponse: RouteFunc = async (request, env) => {
  const credentialedHeaders = getCredentialedHeaders(request.headers, env.ALLOWED_ORIGINS.split(','));
  if (!credentialedHeaders) return new Response('origin not allowed', { status: 401 });

  const { code } = await request.json();

  const response = await getUserAccessTokenResponse(code, env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);

  const { access_token } = await response.json() as { access_token: string };

  return new Response(JSON.stringify({ access_token }), {
    status: 200,
    headers: {
      'Type': 'application/json',
      'Set-Cookie': `access_token=${access_token}; HttpOnly; Secure; SameSite=None`,
      ...credentialedHeaders,
    },
  });
}

export const getLogoutResponse: RouteFunc = async (request, env) => {
  const credentialedHeaders = getCredentialedHeaders(request.headers, env.ALLOWED_ORIGINS.split(','));
  if (!credentialedHeaders) return new Response('origin not allowed', { status: 401 });

  return new Response(null, {
    status: 204,
    headers: {
      'Set-Cookie': `access_token=; Max-Age=0`,
      ...credentialedHeaders,
    },
  })
}