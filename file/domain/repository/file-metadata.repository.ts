import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { FileMetadata } from '../model/file-metadata.ts';

export interface FileMetadataRepository {
  save(file: FileMetadata): Promise<void>;
  get(id: EntityId): Promise<FileMetadata>;
  getAllExpired(): Promise<FileMetadata[]>;
  remove(id: EntityId): Promise<void>;
}
