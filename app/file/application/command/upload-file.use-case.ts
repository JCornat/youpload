import { FileMetadataRepository } from '@file/domain/repository/file-metadata.repository.ts';
import { FileMetadata } from '@file/domain/model/file-metadata.ts';
import { FileStorageProvider } from '@file/domain/provider/file-storage.provider.ts';
import { DateProvider } from '@shared/domain/provider/date.provider.ts';
import { EntityId } from '@shared/domain/model/entity-id.ts';
import { FileStatProvider } from '@file/domain/provider/file-stat.provider.ts';

export interface UploadFileCommand {
  name: string;
  filePath: string;
  expireAt: Date;
}

export class UploadFileUseCase {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
    private readonly fileStorageProvider: FileStorageProvider,
    private readonly fileStatProvider: FileStatProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(uploadFileCommand: UploadFileCommand): Promise<EntityId> {
    const filePath = uploadFileCommand.filePath;
    const sizeInBytes = await this.fileStatProvider.getSize(filePath);
    const props = {
      createdAt: this.dateProvider.getNow(),
      expireAt: new Date(uploadFileCommand.expireAt),
      name: uploadFileCommand.name,
      size: sizeInBytes,
    };

    const fileMetadata = FileMetadata.create(props);
    await this.fileMetadataRepository.save(fileMetadata);
    await this.fileStorageProvider.save(fileMetadata.id, filePath);
    return fileMetadata.id;
  }
}
