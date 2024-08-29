import {StubDateProvider} from "../../../../../shared/domain/provider/date.provider.stub.ts";
import {PasswordHashingBcryptRepository} from "../../../../../user/infrastructure/provider/password-hashing.bcrypt.repository.ts";
import {SessionFileSystemRepository} from "../../../../../user/infrastructure/repository/session.fs.repository.ts";
import {UserFileSystemRepository} from "../../../../../user/infrastructure/repository/user.fs.repository.ts";
import {SignInCommand, SignInUseCase} from "../../../../../user/application/service/sign-in.use-case.ts";
import { getCookies, setCookie } from '@std/http/cookie';
import { Handlers, FreshContext } from '$fresh/server.ts';

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext) {
    if (ctx.state.isLoggedIn) {
      return new Response('Already logged', { status: 400 });
    }

    const dateProvider = new StubDateProvider();
    const passwordHashingRepository = new PasswordHashingBcryptRepository();
    const sessionRepository = new SessionFileSystemRepository();
    const userRepository = new UserFileSystemRepository();
    const signInUseCase = new SignInUseCase(dateProvider, passwordHashingRepository, sessionRepository, userRepository);
    const form = await req.json();
    const command: SignInCommand = {
      email: form.email as string,
      password: form.password as string,
      ip: ctx.remoteAddr.hostname,
      agent: req.headers.get('user-agent') as string,
    };

    const sessionId = await signInUseCase.handle(command);
    const headers = new Headers();
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
    return new Response(null, {
      status: 303, // "See Other"
      headers,
    });
  },
}