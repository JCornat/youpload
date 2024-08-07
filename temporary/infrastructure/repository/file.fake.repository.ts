import { File } from '../../domain/file.ts';
import { FileRepository } from '../../domain/repository/file.repository.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';

export class FileFakeRepository implements FileRepository {
  store: Map<EntityId, File> = new Map();

  save(file: File): Promise<void> {
    this.store.set(file.id, file);
    return Promise.resolve();
  }

  get(id: EntityId): Promise<File> {
    const file = this.store.get(id);
    if (!file) {
      throw new NotFoundException();
    }

    return Promise.resolve(file);
  }
}
