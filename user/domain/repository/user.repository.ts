import { User } from '../model/user.ts';

export interface UserRepository {
  create(user: User): Promise<void>
}