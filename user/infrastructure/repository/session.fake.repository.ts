import { Session } from '../../domain/model/session.ts';
import {SessionRepository} from "../../domain/repository/session.repository.ts";
import {EntityId} from "../../../shared/domain/model/entity-id.ts";
import {NotFoundException} from "../../../shared/lib/exceptions.ts";

export class SessionFakeRepository implements SessionRepository {
  store: Map<EntityId, Session> = new Map();

  get(id: string): Promise<Session> {
    const session = this.store.get(id);
    if (!session) {
      throw new NotFoundException();
    }

    return Promise.resolve(session);
  }

  create(session: Session): Promise<void> {
    this.store.set(session.id, session);
    return Promise.resolve();
  }
}