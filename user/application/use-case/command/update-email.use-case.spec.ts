import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '../../../test/user.fixture.ts';
import { userBuilder } from '../../../test/user.builder.ts';
import { ArgumentInvalidException, NotFoundException, NotMatchingPasswordException } from '../../../../shared/lib/exceptions.ts';

describe('UpdateEmailUseCase', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall update user email', async () => {
    const user = userBuilder()
      .withEmail('old@email.com')
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newEmail: 'new@email.com',
      currentPassword: user.password.value,
    };

    await fixture.whenUpdateEmail(command);

    await fixture.thenUserEmailShouldBe(command.newEmail);
  });

  it(`shall throw an exception if user doesn't exist`, async () => {
    const command = {
      userId: '404',
      newEmail: 'new@email.com',
      currentPassword: 'test1234',
    };

    await fixture.whenUpdateEmail(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });

  it(`shall throw an exception if sent password doesn't match`, async () => {
    const user = userBuilder()
      .withPassword('test1234')
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newEmail: 'new@email.com',
      currentPassword: 'FAIL',
    };

    await fixture.whenUpdateEmail(command);

    fixture.thenExpectedErrorShallBe(NotMatchingPasswordException);
  });

  it(`shall throw an exception if new email is not valid`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newEmail: 'invalid',
      currentPassword: user.password.value,
    };

    await fixture.whenUpdateEmail(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it(`shall throw an exception if userId is null`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: null as any,
      newEmail: 'new@email.com',
      currentPassword: user.password.value,
    };

    await fixture.whenUpdateEmail(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it(`shall throw an exception if email is null`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newEmail: null as any,
      currentPassword: user.password.value,
    };

    await fixture.whenUpdateEmail(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it(`shall throw an exception if password is null`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newEmail: 'new@email.com',
      currentPassword: null as any,
    };

    await fixture.whenUpdateEmail(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });
});
