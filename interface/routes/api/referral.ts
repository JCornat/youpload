import { FreshContext, Handlers } from '$fresh/server.ts';
import { GetReferralUseCase } from '../../../app/user/application/use-case/query/get-referral.use-case.ts';
import { UserFileSystemRepository } from '../../../app/user/infrastructure/repository/user.fs.repository.ts';

export const handler = {
  async GET(_req: Request, ctx: FreshContext) {
    if (!ctx.state.isLoggedIn) {
      return new Response('Unauthorized', { status: 403 });
    }

    const userRepository = new UserFileSystemRepository();
    const getReferralUseCase = new GetReferralUseCase(userRepository);
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
