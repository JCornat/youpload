import { beforeEach, describe, it } from '@std/testing/bdd';
import { assertEquals, assertNotEquals } from '@std/assert';
import { ReferralSlugProvider } from '@user/infrastructure/provider/referral-slug.provider.ts';

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
