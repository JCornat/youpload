import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { FileMetadataRepository } from '../../../domain/repository/file-metadata.repository.ts';
import { ExpiredFileException } from '../../../../shared/lib/exceptions.ts';
import { DateProvider } from '../../../../shared/domain/provider/date.provider.ts';
import { FileMetadata } from '../../../domain/model/file-metadata.ts';

export interface InspectFileQuery {
  id: EntityId;
}

export class InspectFileUseCase {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
    private readonly dateProvider: DateProvider,
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
