import { FreshContext, Handlers, PageProps } from '$fresh/server.ts';
import Header from '../components/header.tsx';
import FileUploadForm from '../islands/file-upload-form.tsx';

interface Data {
  isLoggedIn?: boolean;
}

export const handler = {
  async GET(req: Request, ctx: FreshContext) {
    return await ctx.render({ isLoggedIn: ctx.state.isLoggedIn });
  },
} as Handlers;

export default function Home({ data }: PageProps<Data>) {
  return (
    <>
      <div class='px-4 py-4 mx-auto bg-slate-100 min-h-screen'>
        <Header isLoggedIn={data.isLoggedIn} hideLogo={true} />

        <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
          <a href='/'>
            <img
              class='my-4'
              src='/logo.svg'
              width='128'
              height='128'
              alt='the Fresh logo: a sliced lemon dripping with juice'
            />
          </a>

          <h1 class='text-4xl font-bold mb-8 text-center'>
            Welcome to
            <a href='/'>
              <span class={'ml-2 text-yellow-400'}>You</span>
              <span class={'text-slate-500'}>pload</span>
            </a>
          </h1>

          <FileUploadForm />
        </div>
      </div>
    </>
  );
}
