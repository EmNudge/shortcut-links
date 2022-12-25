import { getPayload } from '$lib/getPayload';
import { error, type RequestHandler, json } from '@sveltejs/kit';

const getRedirectsKV = (platform: Readonly<App.Platform>) => {
  const REDIRECTS_KV = platform.env?.REDIRECTS_KV;
  if (!REDIRECTS_KV) throw error(500, 'cannot find redirects');

  return REDIRECTS_KV;
}

export const POST: RequestHandler = async ({ platform, request }) => {
  const redirectsKv = getRedirectsKV(platform);

  const { name, url } = await getPayload(request, { name: 'string', url: 'string' });

  await redirectsKv.put(name, JSON.stringify({ name, url }));

  return json(`link with name "${name}" successfully created`, { status: 200 })
}

export const PUT: RequestHandler = async ({ platform, request }) => {
  const redirectsKv = getRedirectsKV(platform);

  const { name, url } = await getPayload(request, { name: 'string', url: 'string' });

  redirectsKv.put(name, url)

  return json(`link with name "${name}" successfully updated`, { status: 200 })
}

export const DELETE: RequestHandler = async ({ platform, request }) => {
  const redirectsKv = getRedirectsKV(platform);

  const { name } = await getPayload(request, { name: 'string' });

  redirectsKv.delete(name)

  return json(`link with name "${name}" successfully deleted`, { status: 200 })
}