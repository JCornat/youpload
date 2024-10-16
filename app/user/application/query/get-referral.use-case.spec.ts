import { beforeEach, describe, it } from '@std/testing/bdd';
import { createUserFixture, UserFixture } from '@user/test/user.fixture.ts';
import { userBuilder } from '@user/test/user.builder.ts';
import { NotFoundException } from '@shared/lib/exceptions.ts';

describe('GetReferralUseCase', () => {
  let fixture: UserFixture;

  beforeEach(() => {
    fixture = createUserFixture();
  });

  it('shall return user referral', async () => {
    const user = userBuilder()
      .withReferral('12345-12345-12345-12345')
      .build();

    await fixture.givenExistingUser(user);

    const query = {
      userId: user.id,
    };

    await fixture.whenGetReferral(query);

    const expectedReferral = user.referral.value;
    fixture.thenFetchReferralShouldBe(expectedReferral);
  });

  it(`shall throw an exception if user doesn't exist`, async () => {
    const query = {
      userId: '404',
    };

    await fixture.whenGetReferral(query);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });
});
