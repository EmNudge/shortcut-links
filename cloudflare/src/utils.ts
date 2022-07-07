import { Env } from ".";

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
}

export async function getAllLinks(redirects: KVNamespace, _isAuthorized: boolean): Promise<Link[]> {
  const { keys } = await redirects.list();
  const names = keys.map(({ name }) => name) as string[];
  const values = await Promise.all(names.map((name) => redirects.get(name))) as string[];

  return names.map((name, i) => ({ name, url: values[i] })) as Link[];
}

export async function getUserAccessTokenResponse(code: string, clientId: string, clientSecret: string) {
  return fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'cloudflare-worker-links',
        accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      }),
    }
  );
}

export async function getUserLoginResponse(accessToken: string) {
  return await fetch('https://api.github.com/user', {
    headers: {
      'User-Agent': 'cloudflare-worker-links',
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${accessToken}`,
    }
  });
}

type UserAuthResponse = { login: string, name: string } | null;
export async function checkAuthorization(request: Request, env: Env): Promise<UserAuthResponse> {
  const { headers } = request;
  console.log(JSON.stringify(Object.fromEntries(headers.entries())));

  if (!headers.has('Cookie')) return null;

  const cookies = request.headers.get('Cookie')!;
  const cookieMap = new Map(cookies.split(/\s*;\s*/).map(cookie => cookie.split('=') as [string, string]));
  
  const accessToken = cookieMap.get('access_token');
  if (!accessToken) return null;

  const userLoginResponse = await getUserLoginResponse(accessToken);
  const userLogin = await userLoginResponse.json();
  const { login, name } = userLogin as { login: string, name: string };

  const isAllowed = env.ALLOWED_USERS.split(/\s*,\s*/).includes(login);
  return isAllowed ? { login, name } : null;
}

export function getCredentialedHeaders(headers: Headers, allowedOrigins: string[]): Record<string, string> | null {
  const origin = headers.get('Origin')!;
  if (!allowedOrigins.includes(origin)) return null;

  return {
    'Access-Control-Allow-Origin': origin ?? '*', // must be origin for credentials
    'Access-Control-Allow-Credentials': 'true', // must exist for credentials
    'Vary': 'origin', // because ACA-Origin varies
  };
}