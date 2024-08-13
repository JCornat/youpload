import { ValueObject } from '../../../shared/lib/value-object.ts';
import { ArgumentInvalidException } from '../../../shared/lib/exceptions.ts';

interface UserPasswordProps {
  password: string;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  private constructor(props: UserPasswordProps) {
    super(props);
  }

  static create(password: string): UserPassword {
    if (password?.length < 0) {
      throw new ArgumentInvalidException('Invalid file name: Length cannot be less or equal to 0');
    }

    if (password.length > 50) {
      throw new ArgumentInvalidException('Invalid file name: Length cannot be greater than 50 characters');
    }

    return new UserPassword({ password: password });
  }

  get value() {
    return this.props.password;
  }
}
