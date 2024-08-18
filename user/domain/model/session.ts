import { AggregateRoot } from '../../../shared/lib/aggregate-root.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';

export interface SessionProps {
  id: EntityId;
  userId: EntityId;
  ip: string;
  agent: string;
  createdAt: Date;
  lastUsedAt: Date;
}

export interface SessionSerialized {
  id: EntityId;
  userId: EntityId;
  ip: string;
  agent: string;
  createdAt: string;
  lastUsedAt: string;
}

export class Session extends AggregateRoot {
  private constructor(
    id: EntityId,
    private readonly _userId: EntityId,
    private readonly _ip: string,
    private readonly _agent: string,
    private readonly _createdAt: Date,
    private readonly _lastUsedAt: Date,
  ) {
    super(id);
  }

  static create(props: SessionProps): Session {
    return new Session(props.id, props.userId, props.ip, props.agent, props.createdAt, props.lastUsedAt);
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

  serialize(): SessionSerialized {
    return {
      id: this.id,
      userId: this.userId,
      ip: this.ip,
      agent: this.agent,
      createdAt: this.createdAt.toISOString(),
      lastUsedAt: this.lastUsedAt.toISOString(),
    };
  }

  static reconstitute(data: SessionSerialized) {
    const createdAt = new Date(data.createdAt);
    const lastUsedAt = new Date(data.lastUsedAt);

    return new Session(data.id, data.userId, data.ip, data.agent, createdAt, lastUsedAt);
  }
}
