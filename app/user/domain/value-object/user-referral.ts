import { ValueObject } from '@shared/lib/value-object.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';

interface UserReferralProps {
  code: string;
}

export class UserReferral extends ValueObject<UserReferralProps> {
  private constructor(props: UserReferralProps) {
    super(props);
  }

  static create(code: string): UserReferral {
    if (!code) {
      throw new ArgumentInvalidException('Invalid referral code: Cannot be null');
    }

    return new UserReferral({ code });
  }

  get value() {
    return this.props.code;
  }
}
