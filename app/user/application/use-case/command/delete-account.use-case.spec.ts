import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '../../../test/user.fixture.ts';
import { userBuilder } from '../../../test/user.builder.ts';
import { ArgumentInvalidException, NotFoundException, NotMatchingPasswordException } from '../../../../shared/lib/exceptions.ts';

describe('DeleteAccountUseCase', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall delete account', async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      currentPassword: user.password.value,
    };

    await fixture.whenDeleteAccount(command);

    await fixture.thenUserShouldBeRemoved();
  });

  it(`shall throw an exception if user doesn't exist`, async () => {
    const command = {
      userId: '404',
      currentPassword: '404',
    };

    await fixture.whenDeleteAccount(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });

  it(`shall throw an exception if password doesn't match`, async () => {
    const user = userBuilder()
      .withPassword('test1234')
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      currentPassword: 'FAIL',
    };

    await fixture.whenDeleteAccount(command);

    fixture.thenExpectedErrorShallBe(NotMatchingPasswordException);
  });

  it(`shall throw an exception if userId is null`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: null as any,
      currentPassword: user.password.value,
    };

    await fixture.whenDeleteAccount(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it(`shall throw an exception if password is null`, async () => {
    const user = userBuilder().build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      currentPassword: null as any,
    };

    await fixture.whenDeleteAccount(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });
});
