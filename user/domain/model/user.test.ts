import { describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { userBuilder } from '../../test/user.builder.ts';
import { User } from './user.ts';
import { FileMetadata } from '../../../file/domain/model/file-metadata.ts';
import { ArgumentInvalidException } from '../../../shared/lib/exceptions.ts';

describe('User', () => {
  describe('create', () => {
    it('shall create an user with valid inputs', () => {
      const payload = {
        name: 'test',
        email: 'test@test.com',
        password: 'test123',
      };

      const session = User.create(payload);

      const expectedUser = userBuilder()
        .withId(session.id)
        .withName(payload.name)
        .withEmail(payload.email)
        .withPassword(payload.password)
        .build();

      assertEquals(expectedUser, session);
    });

    it('shall throw an error if the name is null', () => {
      const payload = {
        name: null as any,
        email: 'test@test.com',
        password: 'test123',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the name is not a string', () => {
      const payload = {
        name: 12345 as any,
        email: 'test@test.com',
        password: 'test123',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the name length is less than or equal to 2', () => {
      const payload = {
        name: 'Jo',
        email: 'test@test.com',
        password: 'test123',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the name length is greater than 50', () => {
      const payload = {
        name: 'a'.repeat(51),
        email: 'test@test.com',
        password: 'test123',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the email is null', () => {
      const payload = {
        name: 'test',
        email: null as any,
        password: 'test123',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the email is not a string', () => {
      const payload = {
        name: 'test',
        email: 12345 as any,
        password: 'test123',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the email length is less than 3', () => {
      const payload = {
        name: 'test',
        email: 'a@',
        password: 'test123',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the email length is greater than 50', () => {
      const longEmail = 'a'.repeat(40) + '@example.com';
      const payload = {
        name: 'test',
        email: longEmail,
        password: 'test123',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the email does not contain "@"', () => {
      const payload = {
        name: 'test',
        email: 'userexample.com',
        password: 'test123',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the password is null', () => {
      const payload = {
        name: 'test',
        email: 'test@test.com',
        password: null as any,
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the password is not a string', () => {
      const payload = {
        name: 'test',
        email: 'test@test.com',
        password: 12345 as any,
        referral: 'A',
      };

      let thrownError: Error | null = null;

      try {
        User.create(payload);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });
  });
});
