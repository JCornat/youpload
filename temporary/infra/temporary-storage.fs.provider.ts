import { EntityId } from '../../shared/domain/model/entity-id.ts';
import { TemporaryFile } from '../domain/temporary-file.ts';
import { TemporaryStorageProvider } from './temporary-storage.provider.ts';

export class TemporaryStorageFileSystemProvider implements TemporaryStorageProvider {
  directory = './temporary/test/fs';

  async save(temporaryFile: TemporaryFile, filePath: string): Promise<void> {
    const destination = `${this.directory}/${temporaryFile.id}`;
    await Deno.copyFile(filePath, destination);
  }

  async getStream(fileId: EntityId): Promise<ReadableStream> {
    const destination = `${this.directory}/${fileId}`;
    const read = await Deno.open(destination);
    return read.readable;
  }
}
