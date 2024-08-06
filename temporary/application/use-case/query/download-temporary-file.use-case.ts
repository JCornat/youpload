import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { TemporaryFileRepository } from '../../../domain/temporary-file.repository.ts';
import { TemporaryStorageProvider } from '../../../domain/temporary-storage.provider.ts';
import { DateProvider } from '../../../../shared/domain/date.provider.ts';
import { ExpiredFileException } from '../../../../shared/lib/exceptions.ts';

export interface DownloadTemporaryFileQuery {
  id: EntityId;
}

export class DownloadTemporaryFileUseCase {
  constructor(
    private readonly temporaryFileRepository: TemporaryFileRepository,
    private readonly temporaryStorageProvider: TemporaryStorageProvider,
    private readonly dateProvider: DateProvider,
  ) {
  }

  async handle(requestTemporaryFileQuery: DownloadTemporaryFileQuery) {
    const file = await this.temporaryFileRepository.get(requestTemporaryFileQuery.id);

    if (file.expireAt.getTime() < this.dateProvider.getNow().getTime()) {
      throw new ExpiredFileException();
    }

    return this.temporaryStorageProvider.getStream(file.id);
  }
}
