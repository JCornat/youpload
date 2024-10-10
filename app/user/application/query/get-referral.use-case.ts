import { UserRepository } from '../../domain/repository/user.repository.ts';
import { UserReferral } from '../../domain/value-object/user-referral.ts';

export interface GetReferralQuery {
  userId: string;
}

export class GetReferralUseCase {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async handle(getReferralQuery: GetReferralQuery): Promise<UserReferral> {
    const user = await this.userRepository.get(getReferralQuery.userId);
    return user.referral;
  }
}
