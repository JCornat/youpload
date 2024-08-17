import { User } from '../model/user.ts';

export interface UserRepository {
  save(user: User): Promise<void>;
  getByEmail(email: string): Promise<User>;
}
