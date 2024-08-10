import { FileMetadataRepository } from '../../domain/repository/file-metadata.repository.ts';
import { FileStorageProvider } from '../../domain/provider/file-storage.provider.ts';
import { DateProvider } from '../../../shared/domain/date.provider.ts';

export class RemoveExpiredFilesCron {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
    private readonly fileStorageProvider: FileStorageProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute(): Promise<void> {
    const expiredFileMetadataList = await this.fileMetadataRepository.getAllExpired(this.dateProvider.getNow());

    const promises: Promise<unknown>[] = [];
    expiredFileMetadataList.forEach((fileMetadata) => {
      const removeFileMetadataPromise = this.fileMetadataRepository.remove(fileMetadata.id);
      promises.push(removeFileMetadataPromise);

      const removeStoredFilePromise = this.fileStorageProvider.remove(fileMetadata.id);
      promises.push(removeStoredFilePromise);
    });

    await Promise.allSettled(promises);
  }
}
