import { TemporaryFileRepository } from '../../../domain/temporary-file.repository.ts';
import { TemporaryFile } from '../../../domain/temporary-file.ts';
import { TemporaryStorageProvider } from '../../../domain/temporary-storage.provider.ts';
import { DateProvider } from '../../../../shared/domain/date.provider.ts';
import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { FileStatProvider } from '../../../domain/file-stat.provider.ts';

export interface SendTemporaryFileCommand {
  name: string;
  filePath: string;
  expireAt: Date;
}

export class SendTemporaryFileUseCase {
  constructor(
    private readonly temporaryFileRepository: TemporaryFileRepository,
    private readonly temporaryStorageProvider: TemporaryStorageProvider,
    private readonly fileStatProvider: FileStatProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(sendTemporaryFileCommand: SendTemporaryFileCommand): Promise<EntityId> {
    const filePath = sendTemporaryFileCommand.filePath;
    const size = await this.fileStatProvider.getSize(filePath);

    const createdAt = this.dateProvider.getNow();
    const expireAt = new Date(sendTemporaryFileCommand.expireAt);
    const id = crypto.randomUUID();
    const temporaryFile = TemporaryFile.create({ id, name: sendTemporaryFileCommand.name, size, createdAt, expireAt });
    await this.temporaryFileRepository.save(temporaryFile);

    await this.temporaryStorageProvider.save(temporaryFile, filePath);

    return id;
  }
}
