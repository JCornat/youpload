import { Handlers } from '$fresh/server.ts';
import { getCookies } from '@std/http/cookie';
import { PageProps } from '$fresh/server.ts';
import { SignInCommand, SignInUseCase } from '../../../../user/domain/application/service/sign-in.use-case.ts';
import { StubDateProvider } from '../../../../shared/domain/provider/date.provider.stub.ts';
import { PasswordHashingBcryptRepository } from '../../../../user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { SessionFileSystemRepository } from '../../../../user/infrastructure/repository/session.fs.repository.ts';
import { UserFileSystemRepository } from '../../../../user/infrastructure/repository/user.fs.repository.ts';
import { setCookie } from '@std/http/cookie';

export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    return await ctx.render({ isAllowed: cookies.auth === 'bar' });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const dateProvider = new StubDateProvider();
    const passwordHashingRepository = new PasswordHashingBcryptRepository();
    const sessionRepository = new SessionFileSystemRepository();
    const userRepository = new UserFileSystemRepository();
    const signInUseCase = new SignInUseCase(dateProvider, passwordHashingRepository, sessionRepository, userRepository);
    const command: SignInCommand = {
      email: form.get('email') as string,
      password: form.get('password') as string,
      ip: ctx.remoteAddr.hostname,
      agent: req.headers.get('user-agent') as string,
    };

    const sessionId = await signInUseCase.handle(command);
    const headers = new Headers();
    const url = new URL(req.url);
    setCookie(headers, {
      name: 'auth',
      value: sessionId,
      maxAge: 120,
      sameSite: 'Strict',
      domain: url.hostname,
      path: '/',
      secure: true,
    });

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

          <h1 class='text-4xl font-bold'>Login</h1>
          <SignIn />
        </div>
      </div>
    </>
  );
}

function SignIn() {
  return (
    <form method='post'>
      <input type='email' name='email' />
      <br />
      <input type='password' name='password' />
      <br />
      <button type='submit'>Submit</button>
    </form>
  );
}
