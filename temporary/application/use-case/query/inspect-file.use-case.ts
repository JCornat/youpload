import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { FileMetadataRepository } from '../../../domain/repository/file-metadata.repository.ts';
import { ExpiredFileException } from '../../../../shared/lib/exceptions.ts';
import { DateProvider } from '../../../../shared/domain/date.provider.ts';

export interface InspectFileQuery {
  id: EntityId;
}

export class InspectFileUseCase {
  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
    private readonly dateProvider: DateProvider,
  ) {
  }

  async handle(inspectFileQuery: InspectFileQuery): Promise<{ id: string; name: string; size: number; createdAt: string }> {
    const fileMetadata = await this.fileMetadataRepository.get(inspectFileQuery.id);

    if (fileMetadata.expireAt.getTime() < this.dateProvider.getNow().getTime()) {
      throw new ExpiredFileException();
    }

    return {
      id: fileMetadata.id,
      name: fileMetadata.name,
      size: fileMetadata.size,
      createdAt: fileMetadata.createdAt.toISOString(),
    };
  }
}
