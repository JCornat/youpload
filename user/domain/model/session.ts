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
}
