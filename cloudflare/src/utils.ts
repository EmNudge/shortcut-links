export interface Link {
  name: string;
  url: string;
}

export async function updateLink(redirects: KVNamespace, name: string, request: Request) {
  if (!name) {
    const isForm = request.headers.get('Content-Type')?.includes('form');
    if (!isForm) {
      return new Response("malformed data: no name to edit", { status: 400 });
    }

    const body = await request.formData();
    const { name, url } = Object.fromEntries(body) as Record<string, string>;
    await redirects.put(name, url);

    const links = await getAllLinks(redirects);
    const newLinks = links.map(link => link.name === name ? { name, url } : link)
    return new Response(JSON.stringify(newLinks), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  const { url } = await request.json();
  await redirects.put(name, url);

  return new Response(`successfully set "${name}" to "${url}"`);
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