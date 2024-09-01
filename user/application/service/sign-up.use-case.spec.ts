import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '../../test/user.fixture.ts';
import { SignUpCommand } from './sign-up.use-case.ts';
import { userBuilder } from '../../test/user.builder.ts';
import { ArgumentInvalidException, ExistingUserMailException, NotFoundException, NotMatchingPasswordException } from '../../../shared/lib/exceptions.ts';

describe('Feature: Sign up', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall create a valid user', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command: SignUpCommand = {
      name: 'test',
      email: 'a@a',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: referralUser.referral.value,
    };

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

    const command: SignUpCommand = {
      name: 'test',
      email: 'test@test.com',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: 'FAKE',
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });

  it('shall not create a user if email is already taken', async () => {
    const referralUser = userBuilder()
      .withEmail('test@test.com')
      .build();

    await fixture.givenExistingUser(referralUser);

    const command: SignUpCommand = {
      name: 'test',
      email: 'test@test.com',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: referralUser.referral.value,
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ExistingUserMailException);
  });

  it('shall not create a user if user has invalid name', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command: SignUpCommand = {
      name: '',
      email: 'test@test.com',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: referralUser.referral.value,
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it('shall not create a user if user has invalid email', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command: SignUpCommand = {
      name: 'test',
      email: 'email',
      password: '123456789',
      passwordRepeat: '123456789',
      referral: referralUser.referral.value,
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it('shall throw an error if password are not matching', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command: SignUpCommand = {
      name: 'test',
      email: 'email',
      password: '123456789',
      passwordRepeat: '987654321',
      referral: referralUser.referral.value,
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(NotMatchingPasswordException);
  });

  it('shall not create a user if user has invalid password', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command: SignUpCommand = {
      name: 'test',
      email: 'test@test.com',
      password: '',
      passwordRepeat: '',
      referral: referralUser.referral.value,
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });

  it('shall not create a user if user has invalid password', async () => {
    const referralUser = userBuilder().build();
    await fixture.givenExistingUser(referralUser);

    const command: SignUpCommand = {
      name: 'test',
      email: 'test@test.com',
      password: '',
      passwordRepeat: '',
      referral: referralUser.referral.value,
    };

    await fixture.whenUserSignUp(command);

    fixture.thenExpectedErrorShallBe(ArgumentInvalidException);
  });
});
