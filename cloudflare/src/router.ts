import { Env } from './index';

type RouteFunc = (request: Request, env: Env, groups: Record<string, string>) => Promise<Response>;
type RouteGuard = { pattern: URLPattern, func: RouteFunc };
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

export class Router {
    guards: Map<HttpMethod, RouteGuard[]> = new Map();
    enabledCors = false;

    constructor(enableCors?: boolean) {
        this.enabledCors = Boolean(enableCors);
    }

    async process(request: Request, env: Env): Promise<Response> {
        const method = request.method.toUpperCase() as HttpMethod;
        if (method === 'OPTIONS' && this.enabledCors) {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            });
        }

        const guards = this.guards.get(method);
        if (!guards) return new Response('malformed URL', { status: 400 });

        const { pathname } = new URL(request.url);
        for (const guard of guards) {
            const match = guard.pattern.exec({ pathname });
            if (!match) continue;

            return guard.func(request, env, match.pathname.groups);
        }

        return new Response('malformed URL', { status: 400 });
    }

    addRoute(pathname: string, func: RouteFunc, method: HttpMethod) {
        const pattern = new URLPattern({ pathname });
        let guards = this.guards.get(method);
        if (!guards) {
            guards = [];
            this.guards.set(method, guards);
        }
        guards.push({ pattern, func });
    }

    get(pathname: string, func: RouteFunc) {
        this.addRoute(pathname, func, 'GET');
    }

    post(pathname: string, func: RouteFunc) {
        this.addRoute(pathname, func, 'POST');
    }
    put(pathname: string, func: RouteFunc) {
        this.addRoute(pathname, func, 'PUT');
    }
    delete(pathname: string, func: RouteFunc) {
        this.addRoute(pathname, func, 'DELETE');
    }
}