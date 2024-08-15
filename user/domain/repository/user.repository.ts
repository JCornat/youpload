import { User } from '../model/user.ts';

export interface UserRepository {
  save(user: User): Promise<void>;
  getAllByEmail(email: string): Promise<User[]>;
}
