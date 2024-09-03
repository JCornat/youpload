import { FileMetadataRepository } from '../../domain/repository/file-metadata.repository.ts';
import { FileStorageProvider } from '../../domain/provider/file-storage.provider.ts';
import { DateProvider } from '../../../shared/domain/provider/date.provider.ts';

export class RemoveExpiredFilesCron {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
    private readonly fileStorageProvider: FileStorageProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute(): Promise<void> {
    const expiredFileMetadataList = await this.fileMetadataRepository.getAllExpired(this.dateProvider.getNow());

    const fileMetadataRemovePromises = expiredFileMetadataList
      .map((item) => this.fileMetadataRepository.remove(item.id));

    const fileRemovePromises = expiredFileMetadataList
      .map((item) => this.fileStorageProvider.remove(item.id));

    await Promise.allSettled([fileMetadataRemovePromises, fileRemovePromises].flat());
  }
}
