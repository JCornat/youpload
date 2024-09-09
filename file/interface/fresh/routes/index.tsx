import { FreshContext, Handlers, PageProps } from '$fresh/server.ts';
import Header from '../components/header.tsx';
import FileUploadForm from '../islands/file-upload-form.tsx';
import Footer from '../components/footer.tsx';

interface Data {
  isLoggedIn?: boolean;
}

export const handler = {
  async GET(req: Request, ctx: FreshContext) {
    return await ctx.render({ isLoggedIn: ctx.state.isLoggedIn });
  },
} as Handlers;

export default function Home(props: PageProps<Data>) {
  const { isLoggedIn } = props.data;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />

      <div class='mx-auto px-4 flex flex-col items-center justify-center mb-8'>
        <a href='/'>
          <img
            class='my-4'
            src='/logo.svg'
            width='128'
            height='128'
            alt='the Fresh logo: a sliced lemon dripping with juice'
          />
        </a>

        <h1 class='text-3xl font-bold text-center text-slate-700'>
          Welcome to
          <a href='/'>
            <span class={'ml-2 text-blue-600'}>You</span>
            <span>pload</span>
          </a>
        </h1>

        <h2 class={'text-xl'}>Upload and share <span class={'text-blue-600'}>safely</span></h2>
      </div>

      <div className='mb-32'>
        <FileUploadForm />
      </div>

      <Footer/>
    </>
  );
}
