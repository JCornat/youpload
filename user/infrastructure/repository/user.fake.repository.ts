import { UserRepository } from '../../domain/repository/user.repository.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';
import { User } from '../../domain/model/user.ts';

export class UserFakeRepository implements UserRepository {
  store: Map<EntityId, User> = new Map();

  save(user: User): Promise<void> {
    this.store.set(user.id, user);
    return Promise.resolve();
  }

  get(id: EntityId): Promise<User> {
    const fileMetadata = this.store.get(id);
    if (!fileMetadata) {
      throw new NotFoundException();
    }

    return Promise.resolve(fileMetadata);
  }
}
