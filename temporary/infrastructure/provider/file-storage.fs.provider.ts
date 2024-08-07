import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { File } from '../../domain/file.ts';
import { FileStorageProvider } from '../../domain/provider/file-storage.provider.ts';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';

export class FileStorageFileSystemProvider implements FileStorageProvider {
  constructor(
    public directory = './temporary/test/fs',
  ) {
  }

  async save(file: File, filePath: string): Promise<void> {
    const destination = `${this.directory}/${file.id}`;

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
