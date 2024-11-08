import { FreshContext, Handlers } from '$fresh/server.ts';
import { getReferralUseCase } from '../../../app/user/application/query/get-referral.use-case.ts';

export const handler = {
  async GET(_req: Request, ctx: FreshContext) {
    if (!ctx.state.isLoggedIn) {
      return new Response('Unauthorized', { status: 403 });
    }

    const userId = ctx.state.userId as string;

    const headers = new Headers();
    headers.set('Content-Type', `application/json`);

    try {
      const referral = await getReferralUseCase.handle({ userId });
      return new Response(JSON.stringify({ value: referral.value }), { headers });
    } catch {
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
    }
  },
} as Handlers;
