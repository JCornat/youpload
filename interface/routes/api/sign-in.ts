import { DateStubProvider } from '@shared/infrastructure/provider/date.stub.provider.ts';
import { PasswordHashingBcryptRepository } from '@user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { SessionFileSystemRepository } from '@user/infrastructure/repository/session.fs.repository.ts';
import { UserFileSystemRepository } from '@user/infrastructure/repository/user.fs.repository.ts';
import { SignInCommand, SignInUseCase } from '@user/application/command/sign-in.use-case.ts';
import { setCookie } from '@std/http/cookie';
import { FreshContext, Handlers } from '$fresh/server.ts';

export const handler = {
  async POST(req: Request, ctx: FreshContext) {
    if (ctx.state.isLoggedIn) {
      return new Response('Already logged', { status: 400 });
    }

    const dateProvider = new DateStubProvider();
    const passwordHashingRepository = new PasswordHashingBcryptRepository();
    const sessionRepository = new SessionFileSystemRepository();
    const userRepository = new UserFileSystemRepository();
    const signInUseCase = new SignInUseCase(dateProvider, passwordHashingRepository, sessionRepository, userRepository);
    const form = await req.json();
    const command = {
      email: form.email as string,
      password: form.password as string,
      ip: ctx.remoteAddr.hostname,
      agent: req.headers.get('user-agent') as string,
    } satisfies SignInCommand;

    const headers = new Headers();
    headers.set('Content-Type', `application/json`);

    let sessionId: string;

    try {
      sessionId = await signInUseCase.handle(command);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }

    const url = new URL(req.url);
    setCookie(headers, {
      name: 'auth',
      value: sessionId,
      maxAge: 120000,
      sameSite: 'Strict',
      domain: url.hostname,
      path: '/',
      secure: true,
    });

    headers.set('location', '/');
    return new Response(JSON.stringify({ value: 'OK' }), { headers });
  },
} as Handlers;
