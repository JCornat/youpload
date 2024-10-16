import { FileMetadata } from '@file/domain/model/file-metadata.ts';
import { FileMetadataRepository } from '@file/domain/repository/file-metadata.repository.ts';
import { EntityId } from '@shared/domain/model/entity-id.ts';
import { NotFoundException } from '@shared/lib/exceptions.ts';

export class FileMetadataFakeRepository implements FileMetadataRepository {
  store: Map<EntityId, FileMetadata> = new Map();

  save(file: FileMetadata): Promise<void> {
    this.store.set(file.id, file);
    return Promise.resolve();
  }

  get(id: EntityId): Promise<FileMetadata> {
    const fileMetadata = this.store.get(id);
    if (!fileMetadata) {
      throw new NotFoundException();
    }

    return Promise.resolve(fileMetadata);
  }

  getAllExpired(now: Date): Promise<FileMetadata[]> {
    const list = [...this.store.values()];
    const expiredList = list.filter((fileMetadata: FileMetadata) => fileMetadata.isExpired(now));
    return Promise.resolve(expiredList);
  }

  remove(id: EntityId): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }

  getAll(): Promise<FileMetadata[]> {
    return Promise.resolve([...this.store.values()]);
  }
}
