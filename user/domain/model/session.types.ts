import { EntityId } from '../../../shared/domain/model/entity-id.ts';

export type ConstructorPayload = {
  id: EntityId;
  userId: EntityId;
  ip: string;
  agent: string;
  createdAt: Date;
  lastUsedAt: Date;
};

export type CreatePayload = {
  userId: EntityId;
  ip: string;
  agent: string;
  createdAt: string | Date;
  lastUsedAt: string | Date;
};

export type ReconstitutePayload = CreatePayload & {
  id: EntityId;
};

export type SerializedPayload = {
  id: EntityId;
  userId: EntityId;
  ip: string;
  agent: string;
  createdAt: string;
  lastUsedAt: string;
};
