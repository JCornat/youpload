import { UserRepository } from '../../domain/repository/user.repository.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';
import { User } from '../../domain/model/user.ts';
import { UserEmail } from '../../domain/value-object/user-email.ts';

export class UserFakeRepository implements UserRepository {
  store: Map<EntityId, User> = new Map();

  save(user: User): Promise<void> {
    this.store.set(user.id, user);
    return Promise.resolve();
  }

  getByEmail(email: string): Promise<User> {
    const users = [...this.store.values()];
    const filteredUser = users.find((user) => user.email.value === email);
    if (!filteredUser) {
      throw new NotFoundException();
    }

    return Promise.resolve(filteredUser);
  }

  get(id: EntityId): Promise<User> {
    const fileMetadata = this.store.get(id);
    if (!fileMetadata) {
      throw new NotFoundException();
    }

    return Promise.resolve(fileMetadata);
  }
}
