import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { UserName } from '../value-object/user-name.ts';
import { UserEmail } from '../value-object/user-email.ts';
import { UserPassword } from '../value-object/user-password.ts';

export type ConstructorPayload = {
  id: EntityId;
  name: UserName;
  email: UserEmail;
  password: UserPassword;
};

export type CreatePayload = {
  name: string;
  email: string;
  password: string;
};

export type ReconstitutePayload = CreatePayload & {
  id: EntityId;
};

export type SerializedPayload = {
  id: EntityId;
  name: string;
  email: string;
  password: string;
};
