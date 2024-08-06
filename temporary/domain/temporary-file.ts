import { EntityId } from '../../shared/domain/model/entity-id.ts';
import { Entity } from '../../shared/domain/model/entity.ts';
import { ArgumentInvalidException } from '../../shared/lib/exceptions.ts';

export interface TemporaryFileProps {
  id: EntityId;
  name: string;
  size: number;
  createdAt: Date;
}

export class TemporaryFile extends Entity {
  private constructor(
    id: EntityId,
    private readonly _name: string,
    private readonly _size: number,
    private readonly _createdAt: Date,
  ) {
    super(id);
  }

  static create(props: TemporaryFileProps): TemporaryFile {
    if (!props.name) {
      throw new ArgumentInvalidException('Value cannot be empty');
    }

    return new TemporaryFile(props.id, props.name, props.size, props.createdAt);
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

  serialize() {
    return {
      id: this.id,
      name: this.name,
      size: this.size,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static reconstitute(data: any) {
    const createdAt = new Date(data.createdAt);

    return new TemporaryFile(data.id, data.name, data.size, createdAt);
  }
}
