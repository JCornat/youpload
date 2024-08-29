import { FreshContext, Handlers, PageProps } from '$fresh/server.ts';
import SignInForm from '../islands/sign-in/sign-in-form.tsx';

export const handler: Handlers = {
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
  }
};

export default function SignIn() {
  return (
    <>
      <div class='px-4 py-8 mx-auto bg-[#86efac]'>
        <div class='max-w-screen-sm mx-auto flex flex-col items-center justify-center'>
          <img
            class='my-6'
            src='/logo.svg'
            width='128'
            height='128'
            alt='the Fresh logo: a sliced lemon dripping with juice'
          />

          <div class={'p-8 w-full rounded-xl border bg-neutral-50 border-gray-300 border-1 relative overflow-hidden'}>
            <h1 class='text-4xl font-bold'>Login</h1>
            <SignInForm />

            <br />
            <p class='my-6'>
              <a href='/sign-up'>New user ? Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
