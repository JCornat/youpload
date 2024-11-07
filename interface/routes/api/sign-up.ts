import { FreshContext, Handlers } from '$fresh/server.ts';
import { defaultSignUpUseCase } from '../../../app/user/application/command/sign-up.use-case.ts';

export const handler = {
  async POST(req: Request, ctx: FreshContext) {
    const signUpUseCase = defaultSignUpUseCase;
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
