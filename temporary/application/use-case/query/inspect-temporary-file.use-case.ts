import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { TemporaryFileProvider } from '../../../domain/temporary-file.provider.ts';

export interface InspectTemporaryFileQuery {
  id: EntityId;
}

export class InspectTemporaryFileUseCase {
  constructor(
    private readonly temporaryFileProvider: TemporaryFileProvider,
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
