import { EntityId } from 'shared/domain/model/entity-id.ts';
import { FileMetadata } from 'file/domain/file-metadata.ts';
import { FileStorageProvider } from 'file/domain/provider/file-storage.provider.ts';

export class FileStorageFakeProvider implements FileStorageProvider {
  directory = './file/test/file/tmp';

  async save(file: FileMetadata, filePath: string): Promise<void> {
    const destination = `${this.directory}/${file.id}`;
    await Deno.copyFile(filePath, destination);
  }

  async getStream(fileId: EntityId): Promise<ReadableStream> {
    const destination = `${this.directory}/${fileId}`;
    const read = await Deno.open(destination);
    return read.readable;
  }
}
