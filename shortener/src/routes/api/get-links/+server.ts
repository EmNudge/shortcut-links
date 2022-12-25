import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, platform }) => {
	const REDIRECTS_KV = platform.env?.REDIRECTS_KV;
  if (!REDIRECTS_KV) throw error(500, 'cannot find redirects');

  const { keys } = await REDIRECTS_KV.list();
  const names = keys.map(({ name }) => name) as string[];
  const values = await Promise.all(names.map((name) => REDIRECTS_KV.get(name))) as string[];

  const links = values.map(value => {
    try {
      return JSON.parse(value)
    } catch {
      return value;
    }
  });

  return json(links, { status: 200 });
};