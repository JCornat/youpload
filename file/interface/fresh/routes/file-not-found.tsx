import { Head } from '$fresh/runtime.ts';

export default function FileNotFound() {
  return (
    <>
      <Head>
        <title>File not found</title>
      </Head>

      <div class='mx-auto px-4 h-dvh flex flex-col items-center justify-center mb-8'>
        <h1 class='text-3xl font-bold text-center text-slate-700 mb-8'>
          The file requested doesn't exist
        </h1>

        <a href={'/'} class={'underline'}>
          Go back home
        </a>
      </div>
    </>
  );
}
