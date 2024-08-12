import { FileMetadataRepository } from '../../../domain/repository/file-metadata.repository.ts';
import { FileMetadata } from '../../../domain/model/file-metadata.ts';
import { FileStorageProvider } from '../../../domain/provider/file-storage.provider.ts';
import { DateProvider } from '../../../../shared/domain/provider/date.provider.ts';
import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { FileStatProvider } from '../../../domain/provider/file-stat.provider.ts';

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

  async handle(sendFileCommand: UploadFileCommand): Promise<EntityId> {
    const filePath = sendFileCommand.filePath;
    const size = await this.fileStatProvider.getSize(filePath);

    const createdAt = this.dateProvider.getNow();
    const expireAt = new Date(sendFileCommand.expireAt);
    const id = crypto.randomUUID();
    const fileMetadata = FileMetadata.create({ id, name: sendFileCommand.name, size, createdAt, expireAt });
    await this.fileMetadataRepository.save(fileMetadata);

    await this.fileStorageProvider.save(fileMetadata.id, filePath);

    return id;
  }
}
