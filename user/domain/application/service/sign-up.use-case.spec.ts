import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '../../../test/user.fixture.ts';
import { SignUpCommand } from './sign-up.use-case.ts';
import { userBuilder } from '../../../test/user.builder.ts';

describe('Feature: Sign up', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall create a valid user', async () => {
    const command: SignUpCommand = {
      name: 'test',
      email: 'a@a',
      password: 'azerty',
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
});
