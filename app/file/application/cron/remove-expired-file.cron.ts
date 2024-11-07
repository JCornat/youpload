import { FileMetadataRepository } from '@file/domain/repository/file-metadata.repository.ts';
import { FileStorageProvider } from '@file/domain/provider/file-storage.provider.ts';
import { DateProvider } from '@shared/domain/provider/date.provider.ts';
import { defaultFileMetadataRepository } from '../../infrastructure/repository/file-metadata.fs.repository.ts';
import { defaultFileStorageProvider } from '../../infrastructure/provider/file-storage.fs.provider.ts';
import { defaultDateProvider } from '../../../shared/infrastructure/provider/date.stub.provider.ts';

export class RemoveExpiredFilesCron {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository = defaultFileMetadataRepository,
    private readonly fileStorageProvider: FileStorageProvider = defaultFileStorageProvider,
    private readonly dateProvider: DateProvider = defaultDateProvider,
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

export const defaultRemoveExpiredFilesCron = new RemoveExpiredFilesCron();
