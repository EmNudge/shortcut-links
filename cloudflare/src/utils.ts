export interface Link {
  name: string;
  url: string;
}

export async function updateLink(redirects: KVNamespace, name: string, request: Request) {
  const { url, name: jsonName } = await request.json();
  await redirects.put(name ?? jsonName, url);

  return new Response(`successfully set "${name}" to "${url}"`, {
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
    status: 200,
  });
}

export async function getLink(redirects: KVNamespace, name: string) {
  const url = await redirects.get(name);
  if (!url) return new Response(`no redirect for "${name}"`, { status: 404 });

  return Response.redirect(url, 307);
}

export async function getAllLinks(redirects: KVNamespace): Promise<Link[]> {
  const { keys } = await redirects.list();
  const names = keys.map(({ name }) => name) as string[];
  const values = await Promise.all(names.map((name) => redirects.get(name))) as string[];

  return names.map((name, i) => ({ name, url: values[i] })) as Link[];
}