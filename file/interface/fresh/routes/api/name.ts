import { FreshContext, Handlers } from '$fresh/server.ts';
import { GetReferralUseCase } from '../../../../../user/application/use-case/query/get-referral.use-case.ts';
import { UserFileSystemRepository } from '../../../../../user/infrastructure/repository/user.fs.repository.ts';
import { UpdateEmailUseCase } from '../../../../../user/application/use-case/command/update-email.use-case.ts';
import { PasswordHashingBcryptRepository } from '../../../../../user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { ArgumentInvalidException, NotMatchingPasswordException } from '../../../../../shared/lib/exceptions.ts';
import { UpdateNameUseCase } from '../../../../../user/application/use-case/command/update-name.use-case.ts';

export const handler: Handlers = {
  async PUT(req: Request, ctx: FreshContext) {
    if (!ctx.state.isLoggedIn) {
      return new Response('Unauthorized', { status: 403 });
    }

    const userRepository = new UserFileSystemRepository();
    const updateEmailUseCase = new UpdateNameUseCase(userRepository);
    const userId = ctx.state.userId as string;
    const form = await req.json();
    const command = {
      userId,
      newName: form.newName as string,
    };

    const headers = new Headers();
    headers.set('Content-Type', `application/json`);

    try {
      await updateEmailUseCase.handle(command);
      return new Response(JSON.stringify({ value: 'OK' }), { headers });
    } catch (error) {
      if (error instanceof ArgumentInvalidException) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
      }

      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
    }
  },
};