import SignUpForm from '../islands/sign-up/sign-up-form.tsx';
import SignInForm from '../islands/sign-in/sign-in-form.tsx';

export default function Home() {
  return (
    <>
      <div class='px-4 py-8 mx-auto bg-neutral-50'>
        <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
          <a href='/'>
            <img
              class='my-6'
              src='/logo.svg'
              width='128'
              height='128'
              alt='the Fresh logo: a sliced lemon dripping with juice'
            />
          </a>

          <div class={'p-8 w-full rounded-xl border border-gray-300 border-1 relative overflow-hidden flex flex-col md:flex-row'}>
            <div class={'flex-1 mb-8'}>
              <h1 class='text-3xl font-bold'>Sign up</h1>
              <p class={'opacity-50'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur, quidem!</p>
            </div>

            <div class={'flex-1'}>
              <SignUpForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
