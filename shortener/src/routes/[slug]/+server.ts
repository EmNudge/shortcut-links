import { isPrivilegedSession } from "../../hooks.server";
import { error, redirect } from "@sveltejs/kit";
import type { Link } from "src/stores";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, platform, locals }) => {
  const REDIRECTS_KV = platform.env?.REDIRECTS_KV;
  if (!REDIRECTS_KV) throw error(500, 'cannot find redirects');

  if (!params.slug) throw error(400, 'missing link name from URL');

  const [userIsPrivileged, redirectRes] = await Promise.all([isPrivilegedSession(locals), REDIRECTS_KV.get(params.slug)]);
  if (!redirectRes) throw redirect(307, '/?status=404');

  const { url, privileged } = JSON.parse(redirectRes) as Link;
  if (privileged && !userIsPrivileged) {
    // don't give users insight on whether privileged links exist
    throw redirect(307, '/?status=404');
  }

  if (!url) throw error(500, 'url not present on redirect');

  throw redirect(307, url);
}