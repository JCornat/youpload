import { AggregateRoot } from '../../../shared/lib/aggregate-root.ts';
import { FileName } from '../value-object/file-name.ts';
import { FileSize } from '../value-object/file-size.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';

type ConstructorPayload = {
  id: EntityId;
  name: FileName;
  size: FileSize;
  createdAt: Date;
  expireAt: Date;
};

type CreatePayload = {
  name: string;
  size: number;
  createdAt: string | Date;
  expireAt: string | Date;
};

type ReconstitutePayload = CreatePayload & {
  id: EntityId;
};

type ObjectifiedProps = {
  id: EntityId;
  name: string;
  size: number;
  createdAt: string;
  expireAt: string;
};

export class FileMetadata extends AggregateRoot {
  private readonly _name: FileName;
  private readonly _size: FileSize;
  private readonly _createdAt: Date;
  private readonly _expireAt: Date;

  private constructor(payload: ConstructorPayload) {
    super(payload.id);

    this._name = payload.name;
    this._size = payload.size;
    this._createdAt = payload.createdAt;
    this._expireAt = payload.expireAt;
  }

  static create(payload: CreatePayload): FileMetadata {
    const id = this.createEntityId();
    const name = FileName.create(payload.name);
    const size = FileSize.create(payload.size);
    const createdAt = new Date(payload.createdAt);
    const expireAt = new Date(payload.expireAt);
    return new FileMetadata({ id, name, size, createdAt, expireAt });
  }

  get name(): FileName {
    return this._name;
  }

  get size(): FileSize {
    return this._size;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get expireAt(): Date {
    return this._expireAt;
  }

  isExpired(now: Date) {
    return this.expireAt.getTime() < now.getTime();
  }

  toObject(): ObjectifiedProps {
    return {
      id: this.id,
      name: this.name.value,
      size: this.size.value,
      createdAt: this.createdAt.toISOString(),
      expireAt: this.expireAt.toISOString(),
    };
  }

  static reconstitute(payload: ReconstitutePayload) {
    const name = FileName.create(payload.name);
    const size = FileSize.create(payload.size);
    const createdAt = new Date(payload.createdAt);
    const expireAt = new Date(payload.expireAt);
    return new FileMetadata({ id: payload.id, name, size, createdAt, expireAt });
  }
}
