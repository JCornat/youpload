import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { FileRepository } from '../../../domain/repository/file.repository.ts';
import { FileStorageProvider } from '../../../domain/provider/file-storage.provider.ts';
import { DateProvider } from '../../../../shared/domain/date.provider.ts';
import { ExpiredFileException } from '../../../../shared/lib/exceptions.ts';

export interface DownloadFileQuery {
  id: EntityId;
}

export class DownloadFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly fileStorageProvider: FileStorageProvider,
    private readonly dateProvider: DateProvider,
  ) {
  }

  async handle(downloadFileQuery: DownloadFileQuery) {
    const file = await this.fileRepository.get(downloadFileQuery.id);

    if (file.expireAt.getTime() < this.dateProvider.getNow().getTime()) {
      throw new ExpiredFileException();
    }

    return this.fileStorageProvider.getStream(file.id);
  }
}
