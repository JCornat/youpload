import { UserRepository } from '@user/domain/repository/user.repository.ts';
import { UserReferral } from '@user/domain/value-object/user-referral.ts';
import { defaultUserRepository } from '@user/infrastructure/repository/user.fs.repository.ts';

export interface GetReferralQuery {
  userId: string;
}

export class GetReferralUseCase {
  constructor(
    private readonly userRepository: UserRepository = defaultUserRepository,
  ) {}

  async handle(getReferralQuery: GetReferralQuery): Promise<UserReferral> {
    const user = await this.userRepository.get(getReferralQuery.userId);
    return user.referral;
  }
}

export const getReferralUseCase = new GetReferralUseCase();
