import FileUploadForm from '../islands/file-upload-form.tsx';

export default function Home() {
  return (
    <>
      <div class='mx-auto px-4 flex flex-col items-center justify-center mb-8'>
        <a href='/'>
          <img
            class='mt-4 mb-12'
            src='/logo.png'
            width='64'
            height='64'
            alt='Youpload logo: a stylized hourglass'
          />
        </a>

        <h1 class='text-3xl font-bold text-center'>
          Welcome to
          <a href='/'>
            <span class={'ml-2 text-primary-600'}>You</span>
            <span>pload</span>
          </a>
        </h1>

        <h2 class={'text-xl font-semibold'}>
          Upload and share <span class={'text-primary-600'}>safely</span>
        </h2>
      </div>

      <div className='mb-32'>
        <FileUploadForm />
      </div>
    </>
  );
}
