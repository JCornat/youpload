import { AggregateRoot } from '../../../shared/lib/aggregate-root.ts';
import { UserEmail } from '../value-object/user-email.ts';
import { UserName } from '../value-object/user-name.ts';
import { UserPassword } from '../value-object/user-password.ts';
import { UserReferral } from '../value-object/user-referral.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';

type ConstructorPayload = {
  id: EntityId;
  name: UserName;
  email: UserEmail;
  password: UserPassword;
  referral: UserReferral;
};

type CreatePayload = {
  name: string;
  email: string;
  password: string;
  referral: string;
};

type ReconstitutePayload = CreatePayload & {
  id: EntityId;
};

type ObjectifiedProps = {
  id: EntityId;
  name: string;
  email: string;
  password: string;
  referral: string;
};

export class User extends AggregateRoot {
  private _name: UserName;
  private _email: UserEmail;
  private _password: UserPassword;
  private _referral: UserReferral;

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

  get referral(): UserReferral {
    return this._referral;
  }

  toObject(): ObjectifiedProps {
    return {
      id: this.id,
      name: this.name.value,
      email: this.email.value,
      password: this.password.value,
      referral: this.referral.value,
    };
  }

  updateEmail(newEmail: string) {
    this._email = UserEmail.create(newEmail);
  }

  updateName(newName: string) {
    this._name = UserName.create(newName);
  }

  updatePassword(newPassword: string) {
    this._password = UserPassword.create(newPassword);
  }

  static reconstitute(payload: ReconstitutePayload) {
    const name = UserName.create(payload.name);
    const email = UserEmail.create(payload.email);
    const password = UserPassword.create(payload.password);
    const referral = UserReferral.create(payload.referral || 'DEFAULT');
    return new User({ ...payload, name, email, password, referral });
  }
}
