import { FreshContext, Handlers } from '$fresh/server.ts';
import SignInForm from '../islands/sign-in/sign-in-form.tsx';

export const handler = {
  async GET(_req: Request, ctx: FreshContext) {
    if (ctx.state.isLoggedIn) {
      const headers = new Headers();
      headers.set('location', '/');
      return new Response(null, {
        status: 303, // "See Other"
        headers,
      });
    }

    return await ctx.render();
  },
} as Handlers;

export default function SignIn() {
  return (
    <>
      <div class='px-4 pt-8 pb-24 mx-auto'>
        <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
          <a href='/'>
            <img
              class='my-6'
              src='/logo.svg'
              width='128'
              height='128'
              alt='the Fresh logo: a sliced lemon dripping with juice'
            />
          </a>

          <div class={'p-8 w-full rounded-xl border border-gray-300 bg-white/30 border-1 relative overflow-hidden flex flex-col md:flex-row'}>
            <div class={'flex-1 mb-8 md:pr-4'}>
              <h1 class='text-3xl font-bold mb-2'>Login</h1>
              <p class={'opacity-50'}>Access your account to upload larger files.</p>
            </div>

            <div class={'flex-1'}>
              <SignInForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
