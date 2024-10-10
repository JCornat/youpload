import { FreshContext, Handlers } from '$fresh/server.ts';
import { PasswordHashingBcryptRepository } from '../../../app/user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { UserFileSystemRepository } from '../../../app/user/infrastructure/repository/user.fs.repository.ts';
import { SignUpUseCase } from '../../../app/user/application/command/sign-up.use-case.ts';
import { ReferralSlugProvider } from '../../../app/user/infrastructure/provider/referral-slug.provider.ts';

export const handler = {
  async POST(req: Request, ctx: FreshContext) {
    const passwordHashingRepository = new PasswordHashingBcryptRepository();
    const userRepository = new UserFileSystemRepository();
    const referralProvider = new ReferralSlugProvider();
    const signUpUseCase = new SignUpUseCase(userRepository, passwordHashingRepository, referralProvider);
    const form = await req.json();
    const command = {
      name: form.name as string,
      email: form.email as string,
      password: form.password as string,
      passwordRepeat: form.passwordRepeat as string,
      referral: form.referral as string,
    };

    const headers = new Headers();
    headers.set('Content-Type', `application/json`);

    try {
      const userId = await signUpUseCase.handle(command);
      return new Response(JSON.stringify({ value: 'OK' }), { headers });
    } catch (error) {
      console.error(error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
  },
} as Handlers;
