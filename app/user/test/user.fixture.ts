import { SignUpCommand, SignUpUseCase } from '../application/command/sign-up.use-case.ts';
import { User } from '../domain/model/user.ts';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { UserFakeRepository } from '../infrastructure/repository/user.fake.repository.ts';
import { PasswordHashingFakeRepository } from '../infrastructure/provider/password-hashing.fake.repository.ts';
import { SignInCommand, SignInUseCase } from '../application/command/sign-in.use-case.ts';
import { SessionFakeRepository } from '../infrastructure/repository/session.fake.repository.ts';
import { DateStubProvider } from '../../shared/infrastructure/provider/date.stub.provider.ts';
import { ReferralFakeProvider } from '../infrastructure/provider/referral-fake.provider.ts';
import { GetReferralQuery, GetReferralUseCase } from '../application/query/get-referral.use-case.ts';
import { UserReferral } from '../domain/value-object/user-referral.ts';
import { UpdateEmailCommand, UpdateEmailUseCase } from '../application/command/update-email.use-case.ts';
import { UpdatePasswordCommand, UpdatePasswordUseCase } from '../application/command/update-password.use-case.ts';
import { UpdateNameCommand, UpdateNameUseCase } from '../application/command/update-name.use-case.ts';
import { DeleteAccountCommand, DeleteAccountUseCase } from '../application/command/delete-account.use-case.ts';
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
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      return userId;
    },
    whenUserSignIn: async (command: SignInCommand) => {
      try {
        sessionId = await signInUseCase.handle(command);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }
    },
    whenGetReferral: async (query: GetReferralQuery) => {
      try {
        referral = await getReferralUseCase.handle(query);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }
    },
    whenUpdateEmail: async (command: UpdateEmailCommand) => {
      userId = command.userId;

      try {
        await updateEmailUseCase.handle(command);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }
    },
    whenUpdatePassword: async (command: UpdatePasswordCommand) => {
      userId = command.userId;

      try {
        await updatePasswordUseCase.handle(command);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }
    },
    whenUpdateName: async (command: UpdateNameCommand) => {
      userId = command.userId;

      try {
        await updateNameUseCase.handle(command);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }
    },
    whenDeleteAccount: async (command: DeleteAccountCommand) => {
      userId = command.userId;

      try {
        await deleteAccountUseCase.handle(command);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
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
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
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
