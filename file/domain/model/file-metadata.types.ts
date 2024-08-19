import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { FileName } from '../value-object/file-name.ts';
import { FileSize } from '../value-object/file-size.ts';

export type ConstructorPayload = {
  id: EntityId;
  name: FileName;
  size: FileSize;
  createdAt: Date;
  expireAt: Date;
};

export type CreatePayload = {
  name: string;
  size: number;
  createdAt: string | Date;
  expireAt: string | Date;
};

export type ReconstitutePayload = CreatePayload & {
  id: EntityId;
};

export type SerializedPayload = {
  id: EntityId;
  name: string;
  size: number;
  createdAt: string;
  expireAt: string;
};
