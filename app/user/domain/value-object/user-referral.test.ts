import { describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { UserReferral } from '@user/domain/value-object/user-referral.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';

describe('UserReferral', () => {
  it('shall create a VO is the referral is valid', () => {
    const referral = UserReferral.create('AAAAA-BBBBB-CCCCC');
    assertEquals('AAAAA-BBBBB-CCCCC', referral.value);
  });

  it('shall throw an error if the referral is null', () => {
    let thrownError: Error | null = null;

    try {
      UserReferral.create(null as any);
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
