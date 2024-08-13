import { Handlers } from '$fresh/server.ts';
import { getCookies } from '@std/http/cookie';

export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    return await ctx.render({ isAllowed: cookies.auth === 'bar' });
  },
};
