import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import {AggregateRoot} from "../../../shared/lib/aggregate-root.ts";
import { UserEmail } from '../value-object/user-email.ts';
import {UserName} from "../value-object/user-name.ts";
import { UserPassword } from '../value-object/user-password.ts';

export class User extends AggregateRoot {
  private constructor(
    id: EntityId,
    private readonly _name: UserName,
    private readonly _email: UserEmail,
    private readonly _password: UserPassword,
  ) {
    super(id);
  }
}