export interface Link {
  name: string;
  url: string;
}

export async function createLink(redirects: KVNamespace, name: string, url: string) {
  const link = { name, url };
  await redirects.put(name, url);

  return new Response(`successfully created link "${name}" with URL "${url}"`, {
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    }, 
    status: 200,
  });
}

export async function updateLink(redirects: KVNamespace, oldName: string, { url, name }: Link) {
  const promises = [];
  if (oldName !== name) {
    promises.push(redirects.delete(oldName));
  }
  promises.push(redirects.put(name, url));

  await Promise.all(promises);

  return new Response(`successfully set "${name}" to "${url}"`, {
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
    status: 200,
  });
}

export async function deleteLink(redirects: KVNamespace, name: string) {
  await redirects.delete(name);

  return new Response(`successfully deleted "${name}"`, {
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