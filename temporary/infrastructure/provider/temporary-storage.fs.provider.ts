import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { TemporaryFile } from '../../domain/temporary-file.ts';
import { TemporaryStorageProvider } from '../../domain/provider/temporary-storage.provider.ts';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';

export class TemporaryStorageFileSystemProvider implements TemporaryStorageProvider {
  constructor(
    public directory = './temporary/test/fs',
  ) {
  }

  async save(temporaryFile: TemporaryFile, filePath: string): Promise<void> {
    const destination = `${this.directory}/${temporaryFile.id}`;

    try {
      await Deno.copyFile(filePath, destination);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  async getStream(fileId: EntityId): Promise<ReadableStream> {
    const destination = `${this.directory}/${fileId}`;
    try {
      await Deno.lstat(destination);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new NotFoundException();
      }

      throw error;
    }

    const read = await Deno.open(destination);
    return read.readable;
  }
}
