import { FreshContext, Handlers, PageProps } from '$fresh/server.ts';
import AccountPasswordForm from '../islands/account/password-form.tsx';
import AccountEmailForm from '../islands/account/email-form.tsx';
import AccountUsernameForm from '../islands/account/username-form.tsx';
import AccountDeleteForm from '../islands/account/delete-form.tsx';
import AccountReferralForm from '../islands/account/referral-form.tsx';

interface Data {
  isLoggedIn?: boolean;
  userName?: string;
}

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    if (!ctx.state.isLoggedIn) {
      const headers = new Headers();
      headers.set('location', '/');
      return new Response(null, {
        status: 303, // "See Other"
        headers,
      });
    }

    return await ctx.render({ isLoggedIn: ctx.state.isLoggedIn, userName: ctx.state.userName });
  },
};

export default function Account({ data }: PageProps<Data>) {
  return (
    <>
      <div class='px-8 py-8 mx-auto flex items-center bg-slate-100'>
        <img
          src='/logo.svg'
          width='48'
          height='48'
          alt='the Fresh logo: a sliced lemon dripping with juice'
        />

        <h1 class={'ml-4 text-xl font-black'}>
          <span class={'text-yellow-400'}>You</span>
          <span class={'text-slate-500'}>pload</span>
        </h1>
      </div>

      <div class='px-4 py-8 mx-auto bg-slate-100'>
        <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Referral</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-md bg-slate-200'}>
              <AccountReferralForm />
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Username</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-md bg-slate-200'}>
              <AccountUsernameForm />
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Email</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-md bg-slate-200'}>
              <AccountEmailForm />
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Update password</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-md bg-slate-200'}>
              <AccountPasswordForm />
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Danger zone</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-md bg-red-200'}>
              <AccountDeleteForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
