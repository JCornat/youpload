import { FileMetadataRepository } from '../../domain/repository/file-metadata.repository.ts';
import { FileStorageProvider } from '../../domain/provider/file-storage.provider.ts';

export class RemoveExpiredFileCron {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
    private readonly fileStorageProvider: FileStorageProvider,
  ) {}

  async execute(): Promise<void> {
    const fileMetadataList = await this.fileMetadataRepository.getAllExpired();
    fileMetadataList.forEach((fileMetadata) => {
      this.fileMetadataRepository.remove(fileMetadata.id);
      this.fileStorageProvider.remove(fileMetadata.id);
    });
  }
}
