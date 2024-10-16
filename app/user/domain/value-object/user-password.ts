import { ValueObject } from '@shared/lib/value-object.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';

interface UserPasswordProps {
  password: string;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  private constructor(props: UserPasswordProps) {
    super(props);
  }

  static create(password: string): UserPassword {
    if (!password) {
      throw new ArgumentInvalidException('Invalid password: Cannot be null');
    }

    if (typeof password !== 'string') {
      throw new ArgumentInvalidException('Invalid password: Must be a string');
    }

    return new UserPassword({ password: password });
  }

  get value() {
    return this.props.password;
  }
}
