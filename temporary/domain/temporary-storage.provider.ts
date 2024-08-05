import { TemporaryFile } from './temporary-file.ts';
import { EntityId } from '../../shared/domain/model/entity-id.ts';

export interface TemporaryStorageProvider {
  save(temporaryFile: TemporaryFile, filePath: string): Promise<void>;
  getStream(fileId: EntityId): ReadableStream;
}
