import { describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { UserName } from './user-name.ts';
import { ArgumentInvalidException } from '../../../shared/lib/exceptions.ts';

describe('UserName', () => {
  it('shall create a VO is the name is valid', () => {
    const name = UserName.create('John');
    assertEquals('John', name.value)
  });

  it('shall throw an error if the name is null', () => {
    let thrownError: Error | null = null;

    try {
      UserName.create(null as any);
    } catch (error) {
      thrownError = error;
    }

    assertInstanceOf(thrownError, ArgumentInvalidException);
  });

  it('shall throw an error if the name is not a string', () => {
    let thrownError: Error | null = null;

    try {
      UserName.create(12345 as any);
    } catch (error) {
      thrownError = error;
    }

    assertInstanceOf(thrownError, ArgumentInvalidException);
  });

  it('shall throw an error if the name length is less than or equal to 2', () => {
    let thrownError: Error | null = null;

    try {
      UserName.create('Jo');
    } catch (error) {
      thrownError = error;
    }

    assertInstanceOf(thrownError, ArgumentInvalidException);
  });

  it('shall throw an error if the name length is greater than 50', () => {
    let thrownError: Error | null = null;

    try {
      const longName = 'a'.repeat(51);
      UserName.create(longName);
    } catch (error) {
      thrownError = error;
    }

    assertInstanceOf(thrownError, ArgumentInvalidException);
  });
});
