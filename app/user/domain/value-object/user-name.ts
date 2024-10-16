import { ValueObject } from '@shared/lib/value-object.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';

interface UserNameProps {
  name: string;
}

export class UserName extends ValueObject<UserNameProps> {
  private constructor(props: UserNameProps) {
    super(props);
  }

  static create(name: string): UserName {
    if (!name) {
      throw new ArgumentInvalidException('Invalid user name: Cannot be null');
    }

    if (typeof name !== 'string') {
      throw new ArgumentInvalidException('Invalid user name: Cannot be null');
    }

    if (name.length <= 2) {
      throw new ArgumentInvalidException('Invalid user name: Length cannot be less or equal to 2');
    }

    if (name.length > 50) {
      throw new ArgumentInvalidException('Invalid user name: Length cannot be greater than 50 characters');
    }

    return new UserName({ name });
  }

  get value() {
    return this.props.name;
  }
}
