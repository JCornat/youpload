import { FreshContext, Handlers, PageProps } from '$fresh/server.ts';

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
      <div class='px-4 py-8 mx-auto bg-[#86efac]'>
        <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
          <h1 class='text-4xl font-bold'>Referral</h1>
          <fieldset>
            <legend>Information :</legend>
            <input type='password' value='******************************' />
            <button>Reveal</button>
          </fieldset>

          <h1 class='text-4xl font-bold'>Account information</h1>
          <fieldset>
            <legend>Information :</legend>

            <div className='my-4'>
              <label htmlFor='name'>Name</label>
              <br />
              <input type='text' name='name' />
            </div>

            <button>Update</button>
          </fieldset>

          <fieldset>
            <legend>Information :</legend>

            <div className='my-4'>
              <label htmlFor='email'>Email</label>
              <br />
              <input type='email' name='email' />
            </div>

            <div className='my-4'>
              <label htmlFor='current-password'>Current password</label>
              <br />
              <input type='password' name='current-password' />
            </div>

            <button>Update</button>
          </fieldset>

          <h1 class='text-4xl font-bold'>Account security</h1>
          <fieldset>
            <legend>Update password:</legend>

            <div className='my-4'>
              <label htmlFor='current-password'>Current password</label>
              <br />
              <input type='password' name='current-password' />
            </div>

            <div className='my-4'>
              <label htmlFor='new-password'>New password</label>
              <br />
              <input type='password' name='new-password' />
            </div>

            <div className='my-4'>
              <label htmlFor='new-password-repeat'>Repeat new password</label>
              <br />
              <input type='password' name='new-password-repeat' />
            </div>

            <button>Update</button>
          </fieldset>

          <h1 class='text-4xl font-bold'>Danger zone</h1>
          <button>Delete account</button>
        </div>
      </div>
    </>
  );
}
