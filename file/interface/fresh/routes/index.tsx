import FileUploadForm from '../islands/file-upload-form.tsx';

export default function Home() {
  return (
    <>
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

        <h1 class='text-3xl font-bold text-center'>
          Welcome to
          <a href='/'>
            <span class={'ml-2 text-blue-600'}>You</span>
            <span>pload</span>
          </a>
        </h1>

        <h2 class={'text-xl font-semibold'}>
          Upload and share <span class={'text-blue-600'}>safely</span>
        </h2>
      </div>

      <div className='mb-32'>
        <FileUploadForm />
      </div>
    </>
  );
}
