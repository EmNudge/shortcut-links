import { isPrivilegedSession } from '../../../hooks.server';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { Link } from 'src/stores';

const getAllLinks = async (kvNamespace: KVNamespace<string>) => {
  const { keys } = await kvNamespace.list();

  const names = keys.map(({ name }) => name);
  const allGetPromises = names.map((name) => kvNamespace.get(name));

  const values = await Promise.all(allGetPromises);
  return values.map(data => JSON.parse(data ?? '')) as Link[];
}

export const GET: RequestHandler = async ({ platform, locals }) => {
	const REDIRECTS_KV = platform.env?.REDIRECTS_KV;
  if (!REDIRECTS_KV) throw error(500, 'cannot find redirects');

  const [isPrivileged, links] = await Promise.all([isPrivilegedSession(locals), getAllLinks(REDIRECTS_KV)])
  
  const allowedLinks = isPrivileged 
    ? links 
    : links
      .filter(link => !link.hidden && !link.privileged)
      .map(({ name, url }) => ({ name, url }));

  return json(allowedLinks, { status: 200 });
};