import { Head } from '$fresh/runtime.ts';

export default function FileNotFound() {
  return (
    <>
      <Head>
        <title>File not found</title>
      </Head>

      <div class='px-4 py-8 mx-auto bg-[#86efac]'>
        <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
          <img
            class='my-6'
            src='/logo.svg'
            width='128'
            height='128'
            alt='the Fresh logo: a sliced lemon dripping with juice'
          />
          <h1 class='text-4xl font-bold'>File not found</h1>
          <p class='my-4'>
            The file you were looking for doesn't exist.
          </p>
          <a href='/' class='underline'>Go back home</a>
        </div>
      </div>
    </>
  );
}