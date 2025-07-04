import { FreshContext, Handlers } from '$fresh/server.ts';
import { SignUpUseCase } from '@user/application/command/sign-up.use-case.ts';

export const handler = {
  async POST(req: Request, ctx: FreshContext) {
    const form = await req.json();

    const headers = new Headers();
    headers.set('Content-Type', `application/json`);

    try {
      await new SignUpUseCase().handle({
        name: form.name as string,
        email: form.email as string,
        password: form.password as string,
        passwordRepeat: form.passwordRepeat as string,
        referral: form.referral as string,
      });

      return new Response(JSON.stringify({ value: 'OK' }), { headers });
    } catch (error) {
      console.error(error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
  },
} as Handlers;
