import { TemporaryFileRepository } from '../../../domain/temporary-file.repository.ts';
import { TemporaryFile } from '../../../domain/temporary-file.ts';
import { TemporaryStorageProvider } from '../../../domain/temporary-storage.provider.ts';
import { DateProvider } from '../../../../shared/domain/date.provider.ts';
import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { NotFoundException } from '../../../../shared/lib/exceptions.ts';
import { extname } from 'https://deno.land/std@0.177.0/path/posix.ts';

export interface SendTemporaryFileCommand {
  name: string;
  filePath: string;
  expireAt: Date;
}

export class SendTemporaryFileUseCase {
  constructor(
    private readonly temporaryFileProvider: TemporaryFileRepository,
    private readonly temporaryStorageProvider: TemporaryStorageProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(sendTemporaryFileCommand: SendTemporaryFileCommand): Promise<EntityId> {
    const filePath = sendTemporaryFileCommand.filePath;
    const stats = await this.getFileStats(filePath);

    const createdAt = this.dateProvider.getNow();
    const expireAt = new Date(sendTemporaryFileCommand.expireAt);
    const id = crypto.randomUUID();
    const temporaryFile = TemporaryFile.create({ id, name: sendTemporaryFileCommand.name, size: stats.size, createdAt, expireAt });
    await this.temporaryFileProvider.save(temporaryFile);

    await this.temporaryStorageProvider.save(temporaryFile, filePath);

    return id;
  }

  private async getFileStats(filePath: string) {
    try {
      return await Deno.lstat(filePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}
