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
      <Header isLoggedIn={data.isLoggedIn} />

      <div class='max-w-screen-md mx-auto px-4 flex flex-col items-center justify-center'>
        <a href='/'>
          <img
            class='my-4'
            src='/logo.svg'
            width='128'
            height='128'
            alt='the Fresh logo: a sliced lemon dripping with juice'
          />
        </a>

        <h1 class='text-4xl font-bold mb-8 text-center text-slate-700'>
          Welcome to
          <a href='/'>
            <span class={'ml-2 text-blue-600'}>You</span>
            <span>pload</span>
          </a>
        </h1>
      </div>

      <FileUploadForm />
    </>
  );
}
