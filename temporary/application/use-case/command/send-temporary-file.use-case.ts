import { TemporaryFileProvider } from '../../../infrastructure/temporary-file.provider.ts';
import { TemporaryFile } from '../../../domain/temporary-file.ts';
import { TemporaryStorageProvider } from '../../../infrastructure/temporary-storage.provider.ts';
import { DateProvider } from '../../../../shared/domain/date.provider.ts';
import { EntityId } from '../../../../shared/domain/model/entity-id.ts';
import { NotFoundException } from '../../../../shared/lib/exceptions.ts';
import { extname } from 'https://deno.land/std@0.177.0/path/posix.ts';

export interface SendTemporaryFileCommand {
  name: string;
  filePath: string;
}

export class SendTemporaryFileUseCase {
  constructor(
    private readonly temporaryFileProvider: TemporaryFileProvider,
    private readonly temporaryStorageProvider: TemporaryStorageProvider,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(sendTemporaryFileCommand: SendTemporaryFileCommand): Promise<EntityId> {
    const filePath = sendTemporaryFileCommand.filePath;
    const stats = await this.getFileStats(filePath);

    const createdAt = this.dateProvider.getNow();
    const id = `${crypto.randomUUID()}${extname(filePath)}`;
    const temporaryFile = TemporaryFile.create({ id, name: sendTemporaryFileCommand.name, size: stats.size, createdAt });
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
