import { EntityId } from 'shared/domain/model/entity-id.ts';
import { Entity } from 'shared/domain/model/entity.ts';
import { ArgumentInvalidException } from 'shared/lib/exceptions.ts';

export interface FileMetadataProps {
  id: EntityId;
  name: string;
  size: number;
  createdAt: Date;
  expireAt: Date;
}

export interface FileMetadataSerialized {
  id: EntityId;
  name: string;
  size: number;
  createdAt: string;
  expireAt: string;
}

export class FileMetadata extends Entity {
  private constructor(
    id: EntityId,
    private readonly _name: string,
    private readonly _size: number,
    private readonly _createdAt: Date,
    private readonly _expireAt: Date,
  ) {
    super(id);
  }

  static create(props: FileMetadataProps): FileMetadata {
    if (!props.name) {
      throw new ArgumentInvalidException('Value cannot be empty');
    }

    return new FileMetadata(props.id, props.name, props.size, props.createdAt, props.expireAt);
  }

  get name() {
    return this._name;
  }

  get size() {
    return this._size;
  }

  get createdAt() {
    return this._createdAt;
  }

  get expireAt() {
    return this._expireAt;
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      size: this.size,
      createdAt: this.createdAt.toISOString(),
      expireAt: this.expireAt.toISOString(),
    };
  }

  static reconstitute(data: FileMetadataSerialized) {
    const createdAt = new Date(data.createdAt);
    const expireAt = new Date(data.expireAt);

    return new FileMetadata(data.id, data.name, data.size, createdAt, expireAt);
  }
}
