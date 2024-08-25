import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '../../../test/user.fixture.ts';
import { userBuilder } from '../../../test/user.builder.ts';
import { ArgumentInvalidException, NotFoundException, NotMatchingPasswordException } from '../../../../shared/lib/exceptions.ts';

describe('UpdatePasswordUseCase', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall update user password', async () => {
    const user = userBuilder()
      .withPassword('test1234')
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newPassword: '1234test',
      currentPassword: user.password.value,
    };

    await fixture.whenUpdatePassword(command);

    await fixture.thenUserPasswordShouldBe(command.newPassword);
  });

  it(`shall throw an exception if user doesn't exist`, async () => {
    const command = {
      userId: '404',
      newPassword: '1234test',
      currentPassword: 'test1234',
    };

    await fixture.whenUpdatePassword(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });

  it(`shall throw an exception if sent password doesn't match`, async () => {
    const user = userBuilder()
      .withPassword('test1234')
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newPassword: '1234test',
      currentPassword: 'FAIL',
    };

    await fixture.whenUpdatePassword(command);

    fixture.thenExpectedErrorShallBe(NotMatchingPasswordException);
  });

  it(`shall throw an exception if new password is not valid`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newPassword: 1 as any,
      currentPassword: user.password.value,
    };

    await fixture.whenUpdatePassword(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it(`shall throw an exception if userId is null`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: null as any,
      newPassword: '1234test',
      currentPassword: user.password.value,
    };

    await fixture.whenUpdatePassword(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it(`shall throw an exception if email is null`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newPassword: null as any,
      currentPassword: user.password.value,
    };

    await fixture.whenUpdatePassword(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it(`shall throw an exception if password is null`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newPassword: '1234test',
      currentPassword: null as any,
    };

    await fixture.whenUpdatePassword(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });
});
