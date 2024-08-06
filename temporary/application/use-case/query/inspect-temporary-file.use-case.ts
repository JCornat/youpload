import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { TemporaryFileRepository } from '../../../domain/temporary-file.repository.ts';

export interface InspectTemporaryFileQuery {
  id: EntityId;
}

export class InspectTemporaryFileUseCase {
  constructor(
    private readonly temporaryFileProvider: TemporaryFileRepository,
  ) {
  }

  async handle(requestTemporaryFileQuery: InspectTemporaryFileQuery): Promise<{ id: string; name: string; size: number; createdAt: string }> {
    const file = await this.temporaryFileProvider.get(requestTemporaryFileQuery.id);

    return {
      id: file.id,
      name: file.name,
      size: file.size,
      createdAt: file.createdAt.toISOString(),
    };
  }
}
