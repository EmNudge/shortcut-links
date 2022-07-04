import { Env } from './index';

type Middleware = (request: Request, env: Env, next: () => Promise<Response>) => Promise<Response>;
type RouteFunc = (request: Request, env: Env, groups: Record<string, string>) => Promise<Response>;
type RouteGuard = { pattern: URLPattern, func: RouteFunc };
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

export class Router {
    #guards: Map<HttpMethod, RouteGuard[]> = new Map();
    #middleware: Middleware[] = [];

    constructor() {}

    use(middleware: Middleware) {
        this.#middleware.push(middleware);
    }

    async runMiddleware(request: Request, env: Env) {
        for (const middleware of this.#middleware) {
            let allowContinue = false;
            let resolve: (value: Response) => void;
            const promise = new Promise<Response>((res) => resolve = res);

            const response = await middleware(request, env, () => {
                allowContinue = true;
                return promise;
            });
            if (!allowContinue) return response;
            resolve!(new Response(null, { status: 400 }));
        }
    }

    async process(request: Request, env: Env): Promise<Response> {
        const method = request.method.toUpperCase() as HttpMethod;

        this.runMiddleware(request, env);

        const guards = this.#guards.get(method);
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
        let guards = this.#guards.get(method);
        if (!guards) {
            guards = [];
            this.#guards.set(method, guards);
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