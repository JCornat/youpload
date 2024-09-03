import { FreshContext, Handlers } from '$fresh/server.ts';
import { UserFileSystemRepository } from '../../../../../user/infrastructure/repository/user.fs.repository.ts';
import { PasswordHashingBcryptRepository } from '../../../../../user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { ArgumentInvalidException, NotMatchingPasswordException } from '../../../../../shared/lib/exceptions.ts';
import { UpdatePasswordUseCase } from '../../../../../user/application/use-case/command/update-password.use-case.ts';

export const handler = {
  async PUT(req: Request, ctx: FreshContext) {
    if (!ctx.state.isLoggedIn) {
      return new Response('Unauthorized', { status: 403 });
    }

    const userRepository = new UserFileSystemRepository();
    const passwordHashingRepository = new PasswordHashingBcryptRepository();
    const updatePasswordUseCase = new UpdatePasswordUseCase(userRepository, passwordHashingRepository);
    const userId = ctx.state.userId as string;
    const form = await req.json();
    const command = {
      userId,
      newPassword: form.newPassword as string,
      currentPassword: form.currentPassword as string,
    };

    const headers = new Headers();
    headers.set('Content-Type', `application/json`);

    try {
      await updatePasswordUseCase.handle(command);
      return new Response(JSON.stringify({ value: 'OK' }), { headers });
    } catch (error) {
      if (error instanceof ArgumentInvalidException) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
      }

      if (error instanceof NotMatchingPasswordException) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers });
      }

      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
    }
  },
} as Handlers;
