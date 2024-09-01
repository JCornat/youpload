import { beforeEach, describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf, assertNotEquals } from '@std/assert';
import { sessionBuilder } from '../../test/session.builder.ts';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';
import { ReferralSlugProvider } from './referral-slug.provider.ts';

describe('SessionFileSystemRepository', () => {
  let referralSlugProvider: ReferralSlugProvider;

  beforeEach(async () => {
    referralSlugProvider = new ReferralSlugProvider();
  });

  describe('generate', () => {
    it('shall return random referral', async () => {
      const referral = await referralSlugProvider.generate();
      const referral2 = await referralSlugProvider.generate();
      assertNotEquals(referral, referral2);
      console.log(referral, referral2);
      const regexTest = /\w+-\w+-\w+/.test(referral);
      assertEquals(regexTest, true);
    });
  });
});
