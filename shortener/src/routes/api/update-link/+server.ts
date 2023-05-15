import { isPrivilegedSession } from '../../../hooks.server';
import { getPayload } from '$lib/getPayload';
import { error, type RequestHandler, json } from '@sveltejs/kit';
import type { Link, Visbility } from 'src/stores';
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

  const { name, url, privileged, hidden, visibility, category } = await getPayload(request, {
    name: 'string',
    url: 'string',
    privileged: '?boolean',
    hidden: '?boolean',
    visibility: '?string',
    category: '?string',
  });

  const linkName = name.trim().toLowerCase();
  if (INVALID_LINK_NAMES.has(linkName)) {
    throw error(400, 'link name is using a reserved word');
  }

  if (visibility && visibility !== 'public' && visibility !== 'unlisted' && visibility !== 'private') {
    throw error(400, 'link visibility must be one of ["public", "unlisted", "private"]');
  }

  await put(linkName, {
    name: linkName,
    url,
    privileged,
    hidden,
    visibility: visibility as Visbility | undefined,
    category
  });

  return json(`link with name "${linkName}" successfully created`, { status: 200 })
}

export const PUT: RequestHandler = async ({ platform, request, locals }) => {
  if (!await isPrivilegedSession(locals)) {
    throw error(403, 'cannot edit links without logging in.');
  }

  const { put, deleteItem } = getRedirectsKV(platform);

  const { name, url, privileged, hidden, oldName, visibility, category } = await getPayload(request, {
    name: 'string',
    oldName: 'string',
    url: 'string',
    privileged: '?boolean',
    hidden: '?boolean',
    visibility: '?string',
    category: '?string',
  });

  if (visibility && visibility !== 'public' && visibility !== 'unlisted' && visibility !== 'private') {
    throw error(400, 'link visibility must be one of ["public", "unlisted", "private"]');
  }

  const linkName = name.trim().toLowerCase();
  const linkObject = {
    name: linkName, url, privileged, hidden,
    visibility: visibility as Visbility | undefined,
    category
  };

  if (oldName !== linkName) {
    await Promise.all([deleteItem(oldName), put(linkName, linkObject)]);
  } else {
    await put(linkName, linkObject)
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