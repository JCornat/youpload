import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { TemporaryFileRepository } from '../../../domain/repository/temporary-file.repository.ts';
import { ExpiredFileException } from '../../../../shared/lib/exceptions.ts';
import { DateProvider } from '../../../../shared/domain/date.provider.ts';

export interface InspectTemporaryFileQuery {
  id: EntityId;
}

export class InspectTemporaryFileUseCase {
  constructor(
    private readonly temporaryFileRepository: TemporaryFileRepository,
    private readonly dateProvider: DateProvider,
  ) {
  }

  async handle(requestTemporaryFileQuery: InspectTemporaryFileQuery): Promise<{ id: string; name: string; size: number; createdAt: string }> {
    const file = await this.temporaryFileRepository.get(requestTemporaryFileQuery.id);

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
