import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { File } from '../../domain/file.ts';
import { FileStorageProvider } from '../../domain/provider/file-storage.provider.ts';

export class FileStorageFakeProvider implements FileStorageProvider {
  directory = './temporary/test/file/tmp';

  async save(file: File, filePath: string): Promise<void> {
    const destination = `${this.directory}/${file.id}`;
    await Deno.copyFile(filePath, destination);
  }

  async getStream(fileId: EntityId): Promise<ReadableStream> {
    const destination = `${this.directory}/${fileId}`;
    const read = await Deno.open(destination);
    return read.readable;
  }
}
