import { TemporaryFile } from '../../domain/temporary-file.ts';
import { TemporaryFileRepository } from '../../domain/repository/temporary-file.repository.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';

export class TemporaryFileFakeRepository implements TemporaryFileRepository {
  store: Map<EntityId, TemporaryFile> = new Map();

  save(temporaryFile: TemporaryFile): Promise<void> {
    this.store.set(temporaryFile.id, temporaryFile);
    return Promise.resolve();
  }

  get(id: EntityId): Promise<TemporaryFile> {
    const temporaryFile = this.store.get(id);
    if (!temporaryFile) {
      throw new NotFoundException();
    }

    return Promise.resolve(temporaryFile);
  }
}
