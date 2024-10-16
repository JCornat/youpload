import { EntityId } from '@shared/domain/model/entity-id.ts';

export interface FileStorageProvider {
  save(fileId: EntityId, filePath: string): Promise<void>;
  getStream(fileId: EntityId): Promise<ReadableStream>;
  remove(id: EntityId): Promise<void>;
}
