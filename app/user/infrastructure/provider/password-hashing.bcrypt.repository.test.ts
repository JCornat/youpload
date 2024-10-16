import { beforeAll, beforeEach, describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { PasswordHashingBcryptRepository } from '@user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import * as bcrypt from 'bcrypt';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';

describe('PasswordHashingBcryptRepository', () => {
  let passwordHashingBcryptRepository: PasswordHashingBcryptRepository;

  beforeEach(() => {
    passwordHashingBcryptRepository = new PasswordHashingBcryptRepository();
  });

  describe('hash', () => {
    it('shall hash a valid password', async () => {
      const hashedPassword = await passwordHashingBcryptRepository.hash('password');
      const isValid = await bcrypt.compare('password', hashedPassword);
      assertEquals(isValid, true);
    });

    it('shall throw an error is password is empty', async () => {
      let thrownError: Error | null = null;

      try {
        // deno-lint-ignore no-explicit-any
        await passwordHashingBcryptRepository.hash(null as any);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error is password is not a string', async () => {
      let thrownError: Error | null = null;

      try {
        // deno-lint-ignore no-explicit-any
        await passwordHashingBcryptRepository.hash(1 as any);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error is password is less than 8 characters', async () => {
      let thrownError: Error | null = null;

      try {
        await passwordHashingBcryptRepository.hash('1234567');
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error is password is more than 50 characters', async () => {
      let thrownError: Error | null = null;

      try {
        await passwordHashingBcryptRepository.hash('012345678901234567890123456789012345678901234567890');
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });
  });

  describe('compare', () => {
    let hashedPassword: string;

    beforeAll(async () => {
      const salt = await bcrypt.genSalt(8);
      hashedPassword = await bcrypt.hash('password', salt);
    });

    it('shall compare as valid same passwords', async () => {
      const isValid = await passwordHashingBcryptRepository.compare('password', hashedPassword);
      assertEquals(isValid, true);
    });

    it('shall compare as invalid password with case', async () => {
      const isValid = await passwordHashingBcryptRepository.compare('PASSWORD', hashedPassword);
      assertEquals(isValid, false);
    });

    it('shall compare as invalid different passwords', async () => {
      const isValid = await passwordHashingBcryptRepository.compare('test', hashedPassword);
      assertEquals(isValid, false);
    });

    it('shall compare as invalid if hash not sent', async () => {
      const isValid = await passwordHashingBcryptRepository.compare('test', 'test');
      assertEquals(isValid, false);
    });
  });
});
