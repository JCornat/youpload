import { FreshContext, Handlers } from '$fresh/server.ts';
import AccountPasswordForm from '../islands/account/password-form.tsx';
import AccountEmailForm from '../islands/account/email-form.tsx';
import AccountNameForm from '../islands/account/name-form.tsx';
import AccountDeleteForm from '../islands/account/delete-form.tsx';
import AccountReferralForm from '../islands/account/referral-form.tsx';

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

    return await ctx.render();
  },
} as Handlers;

export default function Account() {
  return (
    <>
      <div class='max-w-screen-md mx-auto px-4'>
        <div class='mb-8'>
          <h1 class='text-3xl font-bold'>Account</h1>
          <p class={'opacity-50'}>Manage your information, and retrieve your referral code.</p>
        </div>

        <div class='flex flex-col items-center justify-center'>
          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div>
              <h1 class='text-2xl font-bold'>Referral</h1>
              <p class={'opacity-50'}>Retrieve and share your referral code to invite others and help them create an account.</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 bg-white/30 border-1 relative overflow-hidden'}>
              <img src={'icons/local-activity.svg'} class={'absolute -top-8 -right-4 opacity-10 pointer-events-none rotate-[20deg] z-0'} />

              <div class={'z-10 relative'}>
                <AccountReferralForm />
              </div>
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div>
              <h1 class='text-2xl font-bold'>Username</h1>
              <p class={'opacity-50'}>Update your display name to personalize your account experience.</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 bg-white/30 border-1 relative overflow-hidden'}>
              <img src={'icons/user.svg'} class={'absolute -top-8 -right-4 opacity-10 pointer-events-none rotate-[20deg] z-0'} />

              <div class={'z-10 relative'}>
                <AccountNameForm />
              </div>
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div>
              <h1 class='text-2xl font-bold'>Email</h1>
              <p class={'opacity-50'}>Change or update the email address associated with your account for notifications and recovery.</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 bg-white/30 border-1 relative overflow-hidden'}>
              <img src={'icons/mail.svg'} class={'absolute -top-8 -right-4 opacity-10 pointer-events-none rotate-[20deg] z-0'} />

              <div class={'z-10 relative'}>
                <AccountEmailForm />
              </div>
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div>
              <h1 class='text-2xl font-bold'>Password</h1>
              <p class={'opacity-50'}>Set a new password to enhance the security of your account.</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 bg-white/30 border-1 relative overflow-hidden'}>
              <img src={'icons/key.svg'} class={'absolute -top-8 -right-4 opacity-10 pointer-events-none rotate-[20deg] z-0'} />

              <div class={'z-10 relative'}>
                <AccountPasswordForm />
              </div>
            </div>
          </div>

          <div class='w-full grid gap-4 mb-8 grid-cols-1 md:grid-cols-account'>
            <div>
              <h1 class='text-2xl font-bold'>Danger zone</h1>
              <p class={'opacity-50'}>Permanently delete your account and all associated data. Proceed with caution!</p>
            </div>

            <div class={'p-8 rounded-xl border border-gray-300 bg-white/30 border-1 relative overflow-hidden'}>
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
