import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { TemporaryFileProvider } from '../../../domain/temporary-file.provider.ts';
import { TemporaryStorageProvider } from '../../../domain/temporary-storage.provider.ts';

export interface RequestTemporaryFileQuery {
  id: EntityId;
}

export class RequestTemporaryFileUseCase {
  constructor(
    private readonly temporaryFileProvider: TemporaryFileProvider,
    private readonly temporaryStorageProvider: TemporaryStorageProvider,
  ) {
  }

  async handle(requestTemporaryFileQuery: RequestTemporaryFileQuery) {
    const file = await this.temporaryFileProvider.get(requestTemporaryFileQuery.id);

    return this.temporaryStorageProvider.getStream(file.id);
  }
}
