import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { FileStorageProvider } from '../../domain/provider/file-storage.provider.ts';

export class FileStorageFakeProvider implements FileStorageProvider {
  directory = './app/file/test/file/tmp';

  async save(fileId: EntityId, filePath: string): Promise<void> {
    const destination = `${this.directory}/${fileId}`;
    await Deno.copyFile(filePath, destination);
  }

  async getStream(fileId: EntityId): Promise<ReadableStream> {
    const destination = `${this.directory}/${fileId}`;
    const read = await Deno.open(destination);
    return read.readable;
  }

  async remove(fileId: EntityId): Promise<void> {
    const destination = `${this.directory}/${fileId}`;
    await Deno.remove(destination);
  }

  async exist(fileId: EntityId): Promise<boolean> {
    const destination = `${this.directory}/${fileId}`;

    try {
      await Deno.lstat(destination);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return false;
      }

      throw error;
    }

    return true;
  }
}
