import { describe, it } from '@std/testing/bdd';
import { assertEquals } from '@std/assert';
import { userBuilder } from '../../test/user.builder.ts';
import { User } from './user.ts';

describe('User', () => {
  describe('create', () => {
    it('shall create an user with valid inputs', () => {
      const payload = {
        name: 'test',
        email: 'test@test.com',
        password: 'test123',
        referral: 'BBBBB-CCCCC-DDDDD'
      };

      const session = User.create(payload);

      const expectedUser = userBuilder()
        .withId(session.id)
        .withName(payload.name)
        .withEmail(payload.email)
        .withPassword(payload.password)
        .withReferral(payload.referral)
        .build();

      assertEquals(expectedUser, session);
    });
  });
});
