import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { File } from '../file.ts';

export interface FileRepository {
  save(file: File): Promise<void>;
  get(id: EntityId): Promise<File>;
}
