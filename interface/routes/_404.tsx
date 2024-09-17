import { Head } from '$fresh/runtime.ts';

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>

      <div class='mx-auto px-4 h-dvh flex flex-col items-center justify-center'>
        <h1 class='text-3xl font-bold text-center text-slate-700 mb-4'>
          The page you were looking for doesn't exist
        </h1>

        <a href={'/app/file/interface/fresh/static'} class={'underline'}>
          Go back home
        </a>
      </div>
    </>
  );
}
