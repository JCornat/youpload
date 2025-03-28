import { describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { UserPassword } from '@user/domain/value-object/user-password.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';

describe('UserPassword', () => {
  it('shall create a VO is the password is valid', () => {
    const password = UserPassword.create('valid1234');
    assertEquals('valid1234', password.value);
  });

  it('shall throw an error if the password is null', () => {
    let thrownError: Error | null = null;

    try {
      UserPassword.create(null as any);
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

  it('shall throw an error if the password is not a string', () => {
    let thrownError: Error | null = null;

    try {
      UserPassword.create(12345 as any);
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
