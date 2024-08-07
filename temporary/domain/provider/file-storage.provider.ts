import { File } from '../file.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';

export interface FileStorageProvider {
  save(file: File, filePath: string): Promise<void>;
  getStream(fileId: EntityId): Promise<ReadableStream>;
}
