import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { FileRepository } from '../../../domain/repository/file.repository.ts';
import { ExpiredFileException } from '../../../../shared/lib/exceptions.ts';
import { DateProvider } from '../../../../shared/domain/date.provider.ts';

export interface InspectFileQuery {
  id: EntityId;
}

export class InspectFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly dateProvider: DateProvider,
  ) {
  }

  async handle(inspectFileQuery: InspectFileQuery): Promise<{ id: string; name: string; size: number; createdAt: string }> {
    const file = await this.fileRepository.get(inspectFileQuery.id);

    if (file.expireAt.getTime() < this.dateProvider.getNow().getTime()) {
      throw new ExpiredFileException();
    }

    return {
      id: file.id,
      name: file.name,
      size: file.size,
      createdAt: file.createdAt.toISOString(),
    };
  }
}
