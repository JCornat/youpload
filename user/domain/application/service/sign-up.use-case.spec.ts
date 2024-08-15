import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '../../../test/user.fixture.ts';
import { SignUpCommand } from './sign-up.use-case.ts';
import { userBuilder } from '../../../test/user.builder.ts';
import { ArgumentInvalidException, ExistingUserMailException } from '../../../../shared/lib/exceptions.ts';

describe('Feature: Sign up', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall create a valid user', async () => {
    const command: SignUpCommand = {
      name: 'test',
      email: 'a@a',
      password: '123456789',
    };

    const id = await fixture.whenUserSignUp(command);

    const user = userBuilder()
      .withId(id)
      .withName(command.name)
      .withEmail(command.email)
      .withPassword(command.password)
      .build();

    fixture.thenCreatedUserShallBeEqualToUser(user);
  });

  it('shall not create a user if email is already taken', async () => {
    const user = userBuilder()
      .withEmail('test@test.com')
      .build();

    await fixture.givenExistingUser(user);

    const command: SignUpCommand = {
      name: 'test',
      email: 'test@test.com',
      password: '123456789',
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ExistingUserMailException);
  });

  it('shall not create a user if user has invalid name', async () => {
    const command: SignUpCommand = {
      name: '',
      email: 'test@test.com',
      password: '123456789',
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it('shall not create a user if user has invalid email', async () => {
    const command: SignUpCommand = {
      name: 'test',
      email: 'email',
      password: '123456789',
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it('shall not create a user if user has invalid password', async () => {
    const command: SignUpCommand = {
      name: 'test',
      email: 'test@test.com',
      password: '',
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });
});
