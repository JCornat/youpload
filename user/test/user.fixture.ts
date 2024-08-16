import { SignUpCommand, SignUpUseCase } from '../domain/application/service/sign-up.use-case.ts';
import { User } from '../domain/model/user.ts';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { UserFakeRepository } from '../infrastructure/repository/user.fake.repository.ts';
import { PasswordHashingFakeRepository } from '../infrastructure/provider/password-hashing.fake.repository.ts';
import {SignInCommand, SignInUseCase} from "../domain/application/service/sign-in.use-case.ts";

export const createUserFixture = () => {
  const userRepository = new UserFakeRepository();
  const passwordHashingProvider = new PasswordHashingFakeRepository();
  const signUpUseCase = new SignUpUseCase(userRepository, passwordHashingProvider);
  const signInUseCase = new SignInUseCase();
  let thrownError: Error;

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
      let sessionId = '';

      try {
        sessionId = await signInUseCase.handle(command);
      } catch (error) {
        thrownError = error;
      }

      return sessionId;
    },
    thenCreatedUserShallBeEqualToUser(expectedUser: User) {
      assertEquals(expectedUser, userRepository.store.get(expectedUser.id));
    },
    thenExpectedErrorShallBe: (errorClass: new () => Error) => {
      assertInstanceOf(thrownError, errorClass);
    },
  };
};

export type UserFixture = ReturnType<typeof createUserFixture>;
