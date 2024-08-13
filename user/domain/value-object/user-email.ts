import { ValueObject } from '../../../shared/lib/value-object.ts';
import { ArgumentInvalidException } from '../../../shared/lib/exceptions.ts';

interface UserEmailProps {
  email: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  private constructor(props: UserEmailProps) {
    super(props);
  }

  static create(email: string): UserEmail {
    if (email?.length < 0) {
      throw new ArgumentInvalidException('Invalid email: Length cannot be less or equal to 0');
    }

    if (email.length > 50) {
      throw new ArgumentInvalidException('Invalid email: Length cannot be greater than 50 characters');
    }

    if (!email.includes('@')) {
      throw new ArgumentInvalidException('Invalid email: It should contain an @');
    }

    return new UserEmail({ email: email });
  }

  get value() {
    return this.props.email;
  }
}
