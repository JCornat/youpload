import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '@user/test/user.fixture.ts';
import { SignUpCommand } from '@user/application/command/sign-up.use-case.ts';
import { userBuilder } from '@user/test/user.builder.ts';
import { ArgumentInvalidException, ExistingUserMailException, NotFoundException, NotMatchingPasswordException } from '@shared/lib/exceptions.ts';

describe('Feature: Sign up', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall create a valid user', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command = {
      name: 'test',
      email: 'a@a',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: referralUser.referral.value,
    } satisfies SignUpCommand;

    const id = await fixture.whenUserSignUp(command);

    const expectedUser = userBuilder()
      .withId(id)
      .withName(command.name)
      .withEmail(command.email)
      .withPassword(command.password)
      .withReferral(command.referral)
      .build();

    fixture.thenCreatedUserShallBeEqualToUser(expectedUser);
  });

  it('shall not create a user if referral does not exist', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command = {
      name: 'test',
      email: 'test@test.com',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: 'FAKE',
    } satisfies SignUpCommand;

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });

  it('shall not create a user if email is already taken', async () => {
    const referralUser = userBuilder()
      .withEmail('test@test.com')
      .build();

    await fixture.givenExistingUser(referralUser);

    const command = {
      name: 'test',
      email: 'test@test.com',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: referralUser.referral.value,
    } satisfies SignUpCommand;

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ExistingUserMailException);
  });

  it('shall not create a user if user has invalid name', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command = {
      name: '',
      email: 'test@test.com',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: referralUser.referral.value,
    } satisfies SignUpCommand;

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it('shall not create a user if user has invalid email', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command = {
      name: 'test',
      email: 'email',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: referralUser.referral.value,
    } satisfies SignUpCommand;

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it('shall throw an error if password are not matching', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command = {
      name: 'test',
      email: 'email',
      password: '123456789',
      passwordRepeat: '987654321',
      referral: referralUser.referral.value,
    } satisfies SignUpCommand;

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(NotMatchingPasswordException);
  });

  it('shall not create a user if user has invalid password', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command = {
      name: 'test',
      email: 'test@test.com',
      password: '',
      passwordRepeat: '',
      referral: referralUser.referral.value,
    } satisfies SignUpCommand;

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it('shall not create a user if user has invalid password', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command = {
      name: 'test',
      email: 'test@test.com',
      password: '',
      passwordRepeat: '',
      referral: referralUser.referral.value,
    } satisfies SignUpCommand;

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });
});
