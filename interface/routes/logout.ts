import { FreshContext, Handlers } from '$fresh/server.ts';
import { deleteCookie } from '@std/http/cookie';

export const handler = {
  GET(req: Request, ctx: FreshContext) {
    if (!ctx.state.isLoggedIn) {
      const headers = new Headers();
      headers.set('location', '/');
      return new Response(null, {
        status: 303, // "See Other"
        headers,
      });
    }

    const url = new URL(req.url);
    const headers = new Headers(req.headers);
    deleteCookie(headers, 'auth', { path: '/', domain: url.hostname });

    headers.set('location', '/');
    return new Response(null, {
      status: 302,
      headers,
    });
  },
} as Handlers;
