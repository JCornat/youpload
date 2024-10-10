import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '../../test/user.fixture.ts';
import { userBuilder } from '../../test/user.builder.ts';
import { ArgumentInvalidException, NotFoundException } from '../../../shared/lib/exceptions.ts';

describe('UpdateNameUseCase', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall update user email', async () => {
    const user = userBuilder()
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newName: 'new',
    };

    await fixture.whenUpdateName(command);

    await fixture.thenUserNameShouldBe(command.newName);
  });

  it(`shall throw an exception if user doesn't exist`, async () => {
    const command = {
      userId: '404',
      newName: 'new',
    };

    await fixture.whenUpdateName(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });

  it(`shall throw an exception if new name is not valid`, async () => {
    const user = userBuilder()
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newName: 1 as any,
    };

    await fixture.whenUpdateName(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it(`shall throw an exception if userId is null`, async () => {
    const user = userBuilder()
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: null as any,
      newName: 'new@email.com',
    };

    await fixture.whenUpdateName(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it(`shall throw an exception if email is null`, async () => {
    const user = userBuilder()
      .build();

    await fixture.givenExistingUser(user);

    const command = {
      userId: user.id,
      newName: null as any,
    };

    await fixture.whenUpdateName(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });
});
