import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, platform }) => {
  const REDIRECTS_KV = platform.env?.REDIRECTS_KV;
  if (!REDIRECTS_KV) throw error(500, 'cannot find redirects');

  if (!params.slug) throw error(400, 'missing link name from URL');

  const redirectRes = await REDIRECTS_KV.get(params.slug)
  if (!redirectRes) throw redirect(307, '/?status=404');

  const { url } = JSON.parse(redirectRes);

  if (!url) throw error(500, 'url not present on redirect');

  throw redirect(307, url);
}