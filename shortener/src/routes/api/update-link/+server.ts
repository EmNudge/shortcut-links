import { isPrivilegedSession } from '../../../hooks.server';
import { getPayload } from '$lib/getPayload';
import { error, type RequestHandler, json } from '@sveltejs/kit';
import type { Link } from 'src/stores';
import { INVALID_LINK_NAMES } from '$lib/links';

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

export const POST: RequestHandler = async ({ platform, request, locals }) => {
  if (!await isPrivilegedSession(locals)) {
    throw error(403, 'cannot create links without logging in.');
  }

  const { put } = getRedirectsKV(platform);

  const { name, url, privileged, hidden } = await getPayload(request, {
    name: 'string',
    url: 'string',
    privileged: '?boolean',
    hidden: '?boolean',
  });

  const linkName = name.trim().toLowerCase();
  if (INVALID_LINK_NAMES.has(linkName)) {
    throw error(400, 'link name is using a reserved word');
  }

  await put(linkName, { name: linkName, url, privileged, hidden });

  return json(`link with name "${linkName}" successfully created`, { status: 200 })
}

export const PUT: RequestHandler = async ({ platform, request, locals }) => {
  if (!await isPrivilegedSession(locals)) {
    throw error(403, 'cannot edit links without logging in.');
  }

  const { put, deleteItem } = getRedirectsKV(platform);

  const { name, url, privileged, hidden, oldName } = await getPayload(request, {
    name: 'string',
    oldName: 'string',
    url: 'string',
    privileged: '?boolean',
    hidden: '?boolean',
  });

  const linkName = name.trim().toLowerCase();
  if (oldName !== linkName) {
    await Promise.all([deleteItem(oldName), put(linkName, { name: linkName, url, privileged, hidden })]);
  } else {
    await put(linkName, { name: linkName, url, privileged, hidden })
  }

  return json(`link with name "${linkName}" successfully updated`, { status: 200 })
}

export const DELETE: RequestHandler = async ({ platform, request, locals }) => {
  if (!await isPrivilegedSession(locals)) {
    throw error(403, 'cannot edit links without logging in.');
  }

  const { deleteItem } = getRedirectsKV(platform);

  const { name } = await getPayload(request, { name: 'string' });

  await deleteItem(name);

  return json(`link with name "${name}" successfully deleted`, { status: 200 })
}