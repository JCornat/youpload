import { FreshContext, Handlers } from '$fresh/server.ts';
import { getCookies } from '@std/http/cookie';
import { PasswordHashingBcryptRepository } from '../../../../../user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { UserFileSystemRepository } from '../../../../../user/infrastructure/repository/user.fs.repository.ts';
import { ReferralFakeProvider } from '../../../../../user/infrastructure/provider/referral-fake.provider.ts';
import { SignUpUseCase } from '../../../../../user/application/service/sign-up.use-case.ts';

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext) {
    const passwordHashingRepository = new PasswordHashingBcryptRepository();
    const userRepository = new UserFileSystemRepository();
    const referralFakeProvider = new ReferralFakeProvider();
    const signUpUseCase = new SignUpUseCase(userRepository, passwordHashingRepository, referralFakeProvider);
    const form = await req.json();
    const command = {
      name: form.name as string,
      email: form.email as string,
      password: form.password as string,
      passwordRepeat: form.passwordRepeat as string,
    };

    const userId = await signUpUseCase.handle(command);

    const headers = new Headers();
    headers.set('location', '/');
    return new Response(null, {
      status: 303, // "See Other"
      headers,
    });
  },
};
