import { FileMetadata } from '../model/file-metadata.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';

export interface FileStorageProvider {
  save(fileMetadata: FileMetadata, filePath: string): Promise<void>;
  getStream(fileId: EntityId): Promise<ReadableStream>;
}
