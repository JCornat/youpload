import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '@user/test/user.fixture.ts';
import { userBuilder } from '@user/test/user.builder.ts';
import { SignInCommand } from '@user/application/command/sign-in.use-case.ts';
import { AuthenticationFailedException } from '@shared/lib/exceptions.ts';

describe('SignInUseCase', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall login when email and password are valid', async () => {
    const user = userBuilder()
      .withEmail('test@test.com')
      .withPassword('12345678')
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      email: 'test@test.com',
      password: '12345678',
      ip: '127.0.0.1',
      agent: 'Firefox',
    } satisfies SignInCommand;

    await fixture.whenUserSignIn(command);

    await fixture.thenUserShouldBeSignedIn(user);
  });

  it('shall get an error at login when email is unknown', async () => {
    const user = userBuilder()
      .withEmail('test@test.com')
      .withPassword('12345678')
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      email: 'fail@fail.com',
      password: '12345678',
      ip: '127.0.0.1',
      agent: 'Firefox',
    } satisfies SignInCommand;

    await fixture.whenUserSignIn(command);

    fixture.thenExpectedErrorShallBe(AuthenticationFailedException);
  });

  it('shall get an error at login when password is not valid', async () => {
    const user = userBuilder()
      .withEmail('test@test.com')
      .withPassword('12345678')
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      email: 'test@test.com',
      password: 'fail',
      ip: '127.0.0.1',
      agent: 'Firefox',
    } satisfies SignInCommand;

    await fixture.whenUserSignIn(command);

    fixture.thenExpectedErrorShallBe(AuthenticationFailedException);
  });
});
