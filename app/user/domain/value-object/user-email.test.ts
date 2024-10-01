import { describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { UserEmail } from './user-email.ts';
import { ArgumentInvalidException } from '../../../shared/lib/exceptions.ts';

describe('UserEmail', () => {
  it('shall create a VO is the email is valid', () => {
    const password = UserEmail.create('test@test.com');
    assertEquals('test@test.com', password.value);
  });

  it('shall throw an error if the email is null', () => {
    let thrownError: Error | null = null;

    try {
      UserEmail.create(null as any);
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

  it('shall throw an error if the email is not a string', () => {
    let thrownError: Error | null = null;

    try {
      UserEmail.create(12345 as any);
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

  it('shall throw an error if the email length is less than 3', () => {
    let thrownError: Error | null = null;

    try {
      UserEmail.create('a@');
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

  it('shall throw an error if the email length is greater than 50', () => {
    let thrownError: Error | null = null;

    try {
      const longEmail = 'a'.repeat(40) + '@example.com';
      UserEmail.create(longEmail);
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

  it('shall throw an error if the email does not contain "@"', () => {
    let thrownError: Error | null = null;

    try {
      UserEmail.create('test123');
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

  it('shall throw an error if the email is invalid', () => {
    let thrownError: Error | null = null;

    try {
      UserEmail.create('test123@');
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
