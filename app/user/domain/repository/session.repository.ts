import { Session } from '@user/domain/model/session.ts';

export interface SessionRepository {
  create(session: Session): Promise<void>;
  get(id: string): Promise<Session>;
}
