import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { FileMetadataRepository } from '../../../domain/repository/file-metadata.repository.ts';
import { FileStorageProvider } from '../../../domain/provider/file-storage.provider.ts';
import { DateProvider } from '../../../../shared/domain/provider/date.provider.ts';
import { ExpiredFileException } from '../../../../shared/lib/exceptions.ts';

export interface DownloadFileQuery {
  id: EntityId;
}

export class DownloadFileUseCase {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
    private readonly fileStorageProvider: FileStorageProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(downloadFileQuery: DownloadFileQuery) {
    const fileMetadata = await this.fileMetadataRepository.get(downloadFileQuery.id);

    const now = this.dateProvider.getNow();
    if (fileMetadata.isExpired(now)) {
      throw new ExpiredFileException();
    }

    return this.fileStorageProvider.getStream(fileMetadata.id);
  }
}
