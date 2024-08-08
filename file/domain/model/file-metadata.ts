import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { Entity } from '../../../shared/domain/model/entity.ts';
import { AggregateRoot } from '../../../shared/lib/aggregate-root.ts';
import { ArgumentInvalidException } from '../../../shared/lib/exceptions.ts';
import { FileName } from '../value-object/file-name.ts';
import { FileSize } from '../value-object/file-size.ts';
import {FileExpiredEvent} from "./file-expired-event.ts";

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

export class FileMetadata extends AggregateRoot {
  private constructor(
    id: EntityId,
    private readonly _name: FileName,
    private readonly _size: FileSize,
    private readonly _createdAt: Date,
    private readonly _expireAt: Date,
  ) {
    super(id);
  }

  static create(props: FileMetadataProps): FileMetadata {
    if (!props.name) {
      throw new ArgumentInvalidException('Value cannot be empty');
    }

    return new FileMetadata(props.id, FileName.create(props.name), FileSize.create(props.size), props.createdAt, props.expireAt);
  }

  expire() {
    const event = new FileExpiredEvent(this.id)
    this.addDomainEvent(event);
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
      name: this.name.value,
      size: this.size.value,
      createdAt: this.createdAt.toISOString(),
      expireAt: this.expireAt.toISOString(),
    };
  }

  static reconstitute(data: FileMetadataSerialized) {
    const createdAt = new Date(data.createdAt);
    const expireAt = new Date(data.expireAt);

    return new FileMetadata(data.id, FileName.create(data.name), FileSize.create(data.size), createdAt, expireAt);
  }
}
