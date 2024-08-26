import { FreshContext, Handlers } from '$fresh/server.ts';
import {GetReferralUseCase} from "../../../../../user/application/use-case/query/get-referral.use-case.ts";
import {UserFileSystemRepository} from "../../../../../user/infrastructure/repository/user.fs.repository.ts";
import {UpdateEmailUseCase} from "../../../../../user/application/use-case/command/update-email.use-case.ts";
import {PasswordHashingBcryptRepository} from "../../../../../user/infrastructure/provider/password-hashing.bcrypt.repository.ts";
import {ArgumentInvalidException, NotMatchingPasswordException} from "../../../../../shared/lib/exceptions.ts";

export const handler: Handlers = {
  async PUT(req: Request, ctx: FreshContext) {
    if (!ctx.state.isLoggedIn) {
      return new Response('Unauthorized', {status: 403});
    }

    const userRepository = new UserFileSystemRepository();
    const passwordHashingRepository = new PasswordHashingBcryptRepository();
    const updateEmailUseCase = new UpdateEmailUseCase(userRepository, passwordHashingRepository);
    const userId = ctx.state.userId as string;
    const form = await req.json();
    const command = {
      userId,
      newEmail: form.newEmail as string,
      currentPassword: form.currentPassword as string,
    }

    try {
      await updateEmailUseCase.handle(command);
    } catch (error) {
      if (error instanceof ArgumentInvalidException) {
        return new Response(JSON.stringify({error: 'Invalid argument'}), {status: 400});
      } else if (error instanceof NotMatchingPasswordException) {
        return new Response(JSON.stringify({error: 'Passwords do not match'}), {status: 400});
      } else {
        return new Response(JSON.stringify({error: 'Internal server error'}), {status: 500});
      }
    }

    return new Response(JSON.stringify({value: 'OK'}));
  },
};
