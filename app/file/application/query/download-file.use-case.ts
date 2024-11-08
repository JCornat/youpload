import { EntityId } from '@shared/domain/model/entity-id.ts';
import { FileMetadataRepository } from '@file/domain/repository/file-metadata.repository.ts';
import { FileStorageProvider } from '@file/domain/provider/file-storage.provider.ts';
import { DateProvider } from '@shared/domain/provider/date.provider.ts';
import { ExpiredFileException } from '@shared/lib/exceptions.ts';
import { defaultDateProvider } from '@shared/infrastructure/provider/date.stub.provider.ts';
import { defaultFileStorageProvider } from '@file/infrastructure/provider/file-storage.fs.provider.ts';
import { defaultFileMetadataRepository } from '@file/infrastructure/repository/file-metadata.fs.repository.ts';

export interface DownloadFileQuery {
  id: EntityId;
}

export class DownloadFileUseCase {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository = defaultFileMetadataRepository,
    private readonly fileStorageProvider: FileStorageProvider = defaultFileStorageProvider,
    private readonly dateProvider: DateProvider = defaultDateProvider,
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

export const downloadFileUseCase = new DownloadFileUseCase();
