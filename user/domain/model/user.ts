import { AggregateRoot } from '../../../shared/lib/aggregate-root.ts';
import { UserEmail } from '../value-object/user-email.ts';
import { UserName } from '../value-object/user-name.ts';
import { UserPassword } from '../value-object/user-password.ts';
import { ConstructorPayload, CreatePayload, ReconstitutePayload, SerializedPayload } from './user.types.ts';

export class User extends AggregateRoot {
  private readonly _name: UserName;
  private readonly _email: UserEmail;
  private readonly _password: UserPassword;

  private constructor(payload: ConstructorPayload) {
    super(payload.id);

    this._name = payload.name;
    this._email = payload.email;
    this._password = payload.password;
  }

  static create(props: CreatePayload): User {
    const id = this.createEntityId();
    const name = UserName.create(props.name);
    const email = UserEmail.create(props.email);
    const password = UserPassword.create(props.password);
    return new User({ id, name, email, password });
  }

  get name(): UserName {
    return this._name;
  }

  get email(): UserEmail {
    return this._email;
  }

  get password(): UserPassword {
    return this._password;
  }

  serialize(): SerializedPayload {
    return {
      id: this.id,
      name: this.name.value,
      email: this.email.value,
      password: this.password.value,
    };
  }

  static reconstitute(payload: ReconstitutePayload) {
    const name = UserName.create(payload.name);
    const email = UserEmail.create(payload.email);
    const password = UserPassword.create(payload.password);
    return new User({ ...payload, name, email, password });
  }
}
