import { SignUpCommand, SignUpUseCase } from '../domain/application/service/sign-up.use-case.ts';
import { User } from '../domain/model/user.ts';
import { assertEquals } from '@std/assert';
import { UserFakeRepository } from '../infrastructure/repository/user.fake.repository.ts';
import { PasswordHashingFakeRepository } from '../infrastructure/provider/password-hashing.fake.repository.ts';

export const createUserFixture = () => {
  const userRepository = new UserFakeRepository();
  const passwordHashingProvider = new PasswordHashingFakeRepository();
  const signUpUseCase = new SignUpUseCase(userRepository, passwordHashingProvider);
  let thrownError: Error;

  return {
    whenUserSignUp: async (command: SignUpCommand) => {
      let userId = '';

      try {
        userId = await signUpUseCase.handle(command);
      } catch (error) {
        thrownError = error;
      }

      return userId;
    },
    thenCreatedUserShallBeEqualToUser(expectedUser: User) {
      assertEquals(expectedUser, userRepository.store.get(expectedUser.id));
    },
  };
};

export type UserFixture = ReturnType<typeof createUserFixture>;
