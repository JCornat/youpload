import { Session } from '../model/session.ts';

export interface SessionRepository {
  create(session: Session): Promise<void>;
  get(id: string): Promise<Session>;
}