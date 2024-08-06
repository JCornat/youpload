import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { TemporaryFileRepository } from '../../../domain/temporary-file.repository.ts';
import { TemporaryStorageProvider } from '../../../domain/temporary-storage.provider.ts';

export interface DownloadTemporaryFileQuery {
  id: EntityId;
}

export class DownloadTemporaryFileUseCase {
  constructor(
    private readonly temporaryFileRepository: TemporaryFileRepository,
    private readonly temporaryStorageProvider: TemporaryStorageProvider,
  ) {
  }

  async handle(requestTemporaryFileQuery: DownloadTemporaryFileQuery) {
    const file = await this.temporaryFileRepository.get(requestTemporaryFileQuery.id);

    return this.temporaryStorageProvider.getStream(file.id);
  }
}
