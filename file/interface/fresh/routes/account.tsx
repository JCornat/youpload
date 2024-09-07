import { FreshContext, Handlers, PageProps } from '$fresh/server.ts';
import AccountPasswordForm from '../islands/account/password-form.tsx';
import AccountEmailForm from '../islands/account/email-form.tsx';
import AccountNameForm from '../islands/account/name-form.tsx';
import AccountDeleteForm from '../islands/account/delete-form.tsx';
import AccountReferralForm from '../islands/account/referral-form.tsx';
import Header from '../components/header.tsx';

interface Data {
  isLoggedIn?: boolean;
  userName?: string;
}

export const handler = {
  async GET(_req: Request, ctx: FreshContext) {
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
} as Handlers;

export default function Account({ data }: PageProps<Data>) {
  return (
    <>
      <Header isLoggedIn={data.isLoggedIn} />

      <div class='max-w-screen-md mx-auto px-4'>
        <div class='mb-8'>
          <h1 class='text-3xl font-bold'>Account</h1>
          <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
        </div>

        <div class='flex flex-col items-center justify-center'>
          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Referral</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 border-1 relative overflow-hidden'}>
              <img src={'icons/local-activity.svg'} class={'absolute -top-8 -right-4 opacity-10 pointer-events-none rotate-[20deg] z-0'} />

              <div class={'z-10 relative'}>
                <AccountReferralForm />
              </div>
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Username</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 border-1 relative overflow-hidden'}>
              <img src={'icons/user.svg'} class={'absolute -top-8 -right-4 opacity-10 pointer-events-none rotate-[20deg] z-0'} />

              <div class={'z-10 relative'}>
                <AccountNameForm />
              </div>
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Email</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 border-1 relative overflow-hidden'}>
              <img src={'icons/mail.svg'} class={'absolute -top-8 -right-4 opacity-10 pointer-events-none rotate-[20deg] z-0'} />

              <div class={'z-10 relative'}>
                <AccountEmailForm />
              </div>
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Update password</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 border-1 relative overflow-hidden'}>
              <img src={'icons/key.svg'} class={'absolute -top-8 -right-4 opacity-10 pointer-events-none rotate-[20deg] z-0'} />

              <div class={'z-10 relative'}>
                <AccountPasswordForm />
              </div>
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div class={'pr-8'}>
              <h1 class='text-2xl font-bold'>Danger zone</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, dolore!</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 border-1 relative overflow-hidden'}>
              <img src={'icons/warning.svg'} class={'absolute -top-8 -right-4 opacity-10 pointer-events-none rotate-[20deg] z-0'} />

              <div class={'z-10 relative'}>
                <AccountDeleteForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
