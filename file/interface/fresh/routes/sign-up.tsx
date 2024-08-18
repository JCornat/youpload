import { Handlers } from '$fresh/server.ts';
import { getCookies } from '@std/http/cookie';
import { PageProps } from '$fresh/server.ts';
import { SignInCommand, SignInUseCase } from '../../../../user/domain/application/service/sign-in.use-case.ts';
import { StubDateProvider } from '../../../../shared/domain/provider/date.provider.stub.ts';
import { PasswordHashingBcryptRepository } from '../../../../user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { SessionFileSystemRepository } from '../../../../user/infrastructure/repository/session.fs.repository.ts';
import { UserFileSystemRepository } from '../../../../user/infrastructure/repository/user.fs.repository.ts';
import { setCookie } from '@std/http/cookie';
import { SignUpCommand, SignUpUseCase } from '../../../../user/domain/application/service/sign-up.use-case.ts';

export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    return await ctx.render({ isAllowed: cookies.auth === 'bar' });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const passwordHashingRepository = new PasswordHashingBcryptRepository();
    const userRepository = new UserFileSystemRepository();
    const signUpUseCase = new SignUpUseCase(userRepository, passwordHashingRepository);
    const command: SignUpCommand = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      password: form.get('password') as string,
      passwordRepeat: form.get('password-repeat') as string,
      // refer: req.headers.get('user-agent') as string,
    };

    const userId = await signUpUseCase.handle(command);

    const headers = new Headers();
    headers.set('location', '/');
    return new Response(null, {
      status: 303, // "See Other"
      headers,
    });
  },
};

export default function Home({ data }: PageProps<any>) {
  return (
    <>
      <div class='px-4 py-8 mx-auto bg-[#86efac]'>
        <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
          <img
            class='my-6'
            src='/logo.svg'
            width='128'
            height='128'
            alt='the Fresh logo: a sliced lemon dripping with juice'
          />

          <h1 class='text-4xl font-bold'>Create account</h1>
          <Login />
        </div>
      </div>
    </>
  );
}

function Login() {
  return (
    <form method='post'>
      <input type='name' name='name' />
      <br />
      <input type='email' name='email' />
      <br />
      <input type='password' name='password' />
      <br />
      <input type='password' name='password-repeat' />
      <br />
      <input type='text' name='referal' />
      <br />
      <button type='submit'>Submit</button>
    </form>
  );
}