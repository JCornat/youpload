import { User } from '../model/user.ts';

export interface UserRepository {
  get(id: string): Promise<User>;
  save(user: User): Promise<void>;
  getByEmail(email: string): Promise<User>;
  getByReferral(referral: string): Promise<User>;
  remove(id: string): Promise<void>;
}
