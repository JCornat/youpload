import { UserRepository } from '@user/domain/repository/user.repository.ts';
import { EntityId } from '@shared/domain/model/entity-id.ts';
import { NotFoundException } from '@shared/lib/exceptions.ts';
import { User } from '@user/domain/model/user.ts';

export class UserFakeRepository implements UserRepository {
  store: Map<EntityId, User> = new Map();

  async get(id: EntityId): Promise<User> {
    const fileMetadata = this.store.get(id);
    if (!fileMetadata) {
      throw new NotFoundException();
    }

    return fileMetadata;
  }

  async getByEmail(email: string): Promise<User> {
    const users = [...this.store.values()];
    const filteredUser = users.find((user) => user.email.value === email);
    if (!filteredUser) {
      throw new NotFoundException();
    }

    return filteredUser;
  }

  async getByReferral(email: string): Promise<User> {
    const users = [...this.store.values()];
    const filteredUser = users.find((user) => user.referral.value === email);
    if (!filteredUser) {
      throw new NotFoundException();
    }

    return filteredUser;
  }

  async save(user: User): Promise<void> {
    this.store.set(user.id, user);
  }

  async remove(id: EntityId): Promise<void> {
    this.store.delete(id);
  }
}
