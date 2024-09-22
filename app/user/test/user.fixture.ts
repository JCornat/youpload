import { SignUpCommand, SignUpUseCase } from '../application/service/sign-up.use-case.ts';
import { User } from '../domain/model/user.ts';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { UserFakeRepository } from '../infrastructure/repository/user.fake.repository.ts';
import { PasswordHashingFakeRepository } from '../infrastructure/provider/password-hashing.fake.repository.ts';
import { SignInCommand, SignInUseCase } from '../application/service/sign-in.use-case.ts';
import { SessionFakeRepository } from '../infrastructure/repository/session.fake.repository.ts';
import { DateStubProvider } from '../../shared/infrastructure/provider/date.stub.provider.ts';
import { ReferralFakeProvider } from '../infrastructure/provider/referral-fake.provider.ts';
import { GetReferralQuery, GetReferralUseCase } from '../application/use-case/query/get-referral.use-case.ts';
import { UserReferral } from '../domain/value-object/user-referral.ts';
import re from 'https://esm.sh/v135/preact-render-to-string@6.3.1/X-ZS8q/denonext/preact-render-to-string.mjs';
import { UpdateEmailCommand, UpdateEmailUseCase } from '../application/use-case/command/update-email.use-case.ts';
import { UpdatePasswordCommand, UpdatePasswordUseCase } from '../application/use-case/command/update-password.use-case.ts';
import { UpdateNameCommand, UpdateNameUseCase } from '../application/use-case/command/update-name.use-case.ts';
import { DeleteAccountCommand, DeleteAccountUseCase } from '../application/use-case/command/delete-account.use-case.ts';
import { NotFoundException } from '../../shared/lib/exceptions.ts';

export const createUserFixture = () => {
  const userRepository = new UserFakeRepository();
  const sessionRepository = new SessionFakeRepository();
  const dateProvider = new DateStubProvider();
  const passwordHashingProvider = new PasswordHashingFakeRepository();
  const referralProvider = new ReferralFakeProvider();
  const signUpUseCase = new SignUpUseCase(userRepository, passwordHashingProvider, referralProvider);
  const signInUseCase = new SignInUseCase(dateProvider, passwordHashingProvider, sessionRepository, userRepository);
  const getReferralUseCase = new GetReferralUseCase(userRepository);
  const updateEmailUseCase = new UpdateEmailUseCase(userRepository, passwordHashingProvider);
  const updatePasswordUseCase = new UpdatePasswordUseCase(userRepository, passwordHashingProvider);
  const updateNameUseCase = new UpdateNameUseCase(userRepository);
  const deleteAccountUseCase = new DeleteAccountUseCase(userRepository, passwordHashingProvider);
  let thrownError: Error;
  let sessionId: string;
  let userId: string;
  let referral: UserReferral;

  return {
    givenExistingUser: async (user: User) => {
      await userRepository.save(user);
    },
    whenUserSignUp: async (command: SignUpCommand) => {
      let userId = '';

      try {
        userId = await signUpUseCase.handle(command);
      } catch (error) {
        thrownError = error;
      }

      return userId;
    },
    whenUserSignIn: async (command: SignInCommand) => {
      try {
        sessionId = await signInUseCase.handle(command);
      } catch (error) {
        thrownError = error;
      }
    },
    whenGetReferral: async (query: GetReferralQuery) => {
      try {
        referral = await getReferralUseCase.handle(query);
      } catch (error) {
        thrownError = error;
      }
    },
    whenUpdateEmail: async (command: UpdateEmailCommand) => {
      userId = command.userId;

      try {
        await updateEmailUseCase.handle(command);
      } catch (error) {
        thrownError = error;
      }
    },
    whenUpdatePassword: async (command: UpdatePasswordCommand) => {
      userId = command.userId;

      try {
        await updatePasswordUseCase.handle(command);
      } catch (error) {
        thrownError = error;
      }
    },
    whenUpdateName: async (command: UpdateNameCommand) => {
      userId = command.userId;

      try {
        await updateNameUseCase.handle(command);
      } catch (error) {
        thrownError = error;
      }
    },
    whenDeleteAccount: async (command: DeleteAccountCommand) => {
      userId = command.userId;

      try {
        await deleteAccountUseCase.handle(command);
      } catch (error) {
        thrownError = error;
      }
    },
    thenCreatedUserShallBeEqualToUser(expectedUser: User) {
      assertEquals(expectedUser, userRepository.store.get(expectedUser.id));
    },
    thenUserShouldBeSignedIn: async (expectedUser: User) => {
      const session = await sessionRepository.get(sessionId);
      assertEquals(session.userId, expectedUser.id);
    },
    thenFetchReferralShouldBe: (expectedReferral: string) => {
      assertEquals(referral.value, expectedReferral);
    },
    thenUserEmailShouldBe: async (expectedEmail: string) => {
      const user = await userRepository.get(userId);
      assertEquals(user.email.value, expectedEmail);
    },
    thenUserPasswordShouldBe: async (expectedPassword: string) => {
      const user = await userRepository.get(userId);
      const compare = await passwordHashingProvider.compare(expectedPassword, user.password.value);
      assertEquals(compare, true);
    },
    thenUserNameShouldBe: async (expectedName: string) => {
      const user = await userRepository.get(userId);
      assertEquals(user.name.value, expectedName);
    },
    thenUserShouldBeRemoved: async () => {
      let user: User;

      try {
        user = await userRepository.get(userId);
      } catch (error) {
        thrownError = error;
      }

      assertEquals(user!, undefined);
      assertInstanceOf(thrownError, NotFoundException);
    },
    thenExpectedErrorShallBe: (errorClass: new () => Error) => {
      assertInstanceOf(thrownError, errorClass);
    },
  };
};

export type UserFixture = ReturnType<typeof createUserFixture>;