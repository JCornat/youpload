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
    if (!email) {
      throw new ArgumentInvalidException('Invalid email: Cannot be null');
    }

    if (typeof email !== 'string') {
      throw new ArgumentInvalidException('Invalid email: Must be a string');
    }

    if (email.length < 3) {
      throw new ArgumentInvalidException('Invalid email: Length cannot be less than 3');
    }

    if (email.length > 50) {
      throw new ArgumentInvalidException('Invalid email: Length cannot be greater than 50 characters');
    }

    if (!/[a-zA-Z0-9]@[a-zA-Z0-9]/.test(email)) {
      throw new ArgumentInvalidException('Invalid email');
    }

    return new UserEmail({ email: email });
  }

  get value() {
    return this.props.email;
  }
}
