import { FileMetadata } from '../../domain/file-metadata.ts';
import { FileMetadataRepository } from '../../domain/repository/file-metadata.repository.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';

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
}
