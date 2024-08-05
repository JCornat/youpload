import { EntityId } from '../../shared/domain/model/entity-id.ts';
import { TemporaryFile } from '../domain/temporary-file.ts';

export interface TemporaryFileProvider {
  save(temporaryFile: TemporaryFile): Promise<void>;
  get(id: EntityId): Promise<TemporaryFile>;
}
