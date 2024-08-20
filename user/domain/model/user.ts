import { AggregateRoot } from '../../../shared/lib/aggregate-root.ts';
import { UserEmail } from '../value-object/user-email.ts';
import { UserName } from '../value-object/user-name.ts';
import { UserPassword } from '../value-object/user-password.ts';
import { ConstructorPayload, CreatePayload, ReconstitutePayload, SerializedPayload } from './user.types.ts';
import {UserReferral} from "../value-object/user-referral.ts";

export class User extends AggregateRoot {
  private readonly _name: UserName;
  private readonly _email: UserEmail;
  private readonly _password: UserPassword;
  private readonly _referral: UserReferral;

  private constructor(payload: ConstructorPayload) {
    super(payload.id);

    this._name = payload.name;
    this._email = payload.email;
    this._password = payload.password;
    this._referral = payload.referral;
  }

  static create(props: CreatePayload): User {
    const id = this.createEntityId();
    const name = UserName.create(props.name);
    const email = UserEmail.create(props.email);
    const password = UserPassword.create(props.password);
    const referral = UserReferral.create(props.referral);
    return new User({ id, name, email, password, referral });
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
    const referral = UserReferral.create(payload.referral);
    return new User({ ...payload, name, email, password, referral });
  }
}
