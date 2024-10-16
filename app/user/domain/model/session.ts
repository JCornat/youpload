import { AggregateRoot } from '@shared/lib/aggregate-root.ts';
import { EntityId } from '@shared/domain/model/entity-id.ts';

type ConstructorPayload = {
  id: EntityId;
  userId: EntityId;
  ip: string;
  agent: string;
  createdAt: Date;
  lastUsedAt: Date;
};

type CreatePayload = {
  userId: EntityId;
  ip: string;
  agent: string;
  createdAt: string | Date;
  lastUsedAt: string | Date;
};

type ReconstitutePayload = CreatePayload & {
  id: EntityId;
};

type ObjectifiedProps = {
  id: EntityId;
  userId: EntityId;
  ip: string;
  agent: string;
  createdAt: string;
  lastUsedAt: string;
};

export class Session extends AggregateRoot {
  private readonly _userId: EntityId;
  private readonly _ip: string;
  private readonly _agent: string;
  private readonly _createdAt: Date;
  private readonly _lastUsedAt: Date;

  private constructor(payload: ConstructorPayload) {
    super(payload.id);

    this._userId = payload.userId;
    this._ip = payload.ip;
    this._agent = payload.agent;
    this._createdAt = payload.createdAt;
    this._lastUsedAt = payload.lastUsedAt;
  }

  static create(payload: CreatePayload): Session {
    const id = this.createEntityId();
    const createdAt = new Date(payload.createdAt);
    const lastUsedAt = new Date(payload.lastUsedAt);
    return new Session({ id, ...payload, createdAt, lastUsedAt });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get ip(): string {
    return this._ip;
  }

  get agent(): string {
    return this._agent;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get lastUsedAt(): Date {
    return this._lastUsedAt;
  }

  toObject(): ObjectifiedProps {
    return {
      id: this.id,
      userId: this.userId,
      ip: this.ip,
      agent: this.agent,
      createdAt: this.createdAt.toISOString(),
      lastUsedAt: this.lastUsedAt.toISOString(),
    };
  }

  static reconstitute(payload: ReconstitutePayload) {
    const createdAt = new Date(payload.createdAt);
    const lastUsedAt = new Date(payload.lastUsedAt);
    return new Session({ ...payload, createdAt, lastUsedAt });
  }
}
