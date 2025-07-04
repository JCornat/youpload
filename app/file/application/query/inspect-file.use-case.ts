import { EntityId } from '@shared/domain/model/entity-id.ts';
import { FileMetadataRepository } from '@file/domain/repository/file-metadata.repository.ts';
import { ExpiredFileException } from '@shared/lib/exceptions.ts';
import { DateProvider } from '@shared/domain/provider/date.provider.ts';
import { FileMetadata } from '@file/domain/model/file-metadata.ts';
import { defaultFileMetadataRepository } from '@file/infrastructure/repository/file-metadata.fs.repository.ts';
import { defaultDateProvider } from '@shared/infrastructure/provider/date.native.provider.ts';

export interface InspectFileQuery {
  id: EntityId;
}

export class InspectFileUseCase {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository = defaultFileMetadataRepository,
    private readonly dateProvider: DateProvider = defaultDateProvider,
  ) {}

  async handle(inspectFileQuery: InspectFileQuery): Promise<FileMetadata> {
    const fileMetadata = await this.fileMetadataRepository.get(inspectFileQuery.id);

    const now = this.dateProvider.getNow();
    if (fileMetadata.isExpired(now)) {
      throw new ExpiredFileException();
    }

    return fileMetadata;
  }
}
