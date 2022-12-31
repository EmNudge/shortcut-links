import { getPayload } from '$lib/getPayload';
import { error, type RequestHandler, json } from '@sveltejs/kit';
import type { Link } from 'src/stores';

const getRedirectsKV = (platform: Readonly<App.Platform>) => {
  const REDIRECTS_KV = platform.env?.REDIRECTS_KV;
  if (!REDIRECTS_KV) throw error(500, 'cannot find redirects');

  return {
    async put(name: string, value: Link) {
      return REDIRECTS_KV.put(name, JSON.stringify(value));
    },
    async deleteItem(name: string) {
      return REDIRECTS_KV.delete(name);
    },
  }
}

export const POST: RequestHandler = async ({ platform, request }) => {
  const { put } = getRedirectsKV(platform);

  const { name, url } = await getPayload(request, { name: 'string', url: 'string' });

  await put(name, { name, url });

  return json(`link with name "${name}" successfully created`, { status: 200 })
}

export const PUT: RequestHandler = async ({ platform, request }) => {
  const { put, deleteItem } = getRedirectsKV(platform);

  const { name, url, oldName } = await getPayload(request, { name: 'string', oldName: 'string', url: 'string' });

  if (oldName !== name) {
    await Promise.all([deleteItem(oldName), put(name, { name, url })]);
  } else {
    await put(name, { name, url })
  }

  return json(`link with name "${name}" successfully updated`, { status: 200 })
}

export const DELETE: RequestHandler = async ({ platform, request }) => {
  const { deleteItem } = getRedirectsKV(platform);

  const { name } = await getPayload(request, { name: 'string' });

  await deleteItem(name);

  return json(`link with name "${name}" successfully deleted`, { status: 200 })
}