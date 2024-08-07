import {FileMetadata, FileMetadataSerialized} from '../../domain/file-metadata.ts';
import { FileMetadataRepository } from '../../domain/repository/file-metadata.repository.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { NotFoundException, ParseErrorException } from '../../../shared/lib/exceptions.ts';

export class FileMetadataFileSystemRepository implements FileMetadataRepository {
  constructor(
    public filePath = './file-metadata.ts',
  ) {
  }

  async save(fileMetadata: FileMetadata): Promise<void> {
    const files = await this.getContent();
    files.push(fileMetadata);

    const serializedFiles = files.map((temp) => temp.serialize());
    await Deno.writeTextFile(this.filePath, JSON.stringify(serializedFiles), { create: true });
  }

  async get(id: EntityId): Promise<FileMetadata> {
    const fileMetadataList = await this.getContent();
    const fileMetadata = fileMetadataList.find((item) => item.id === id);
    if (!fileMetadata) {
      throw new NotFoundException();
    }

    return fileMetadata;
  }

  private async getContent(): Promise<FileMetadata[]> {
    let content: string;

    try {
      content = await Deno.readTextFile(this.filePath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      content = '[]';
    }

    let array: FileMetadataSerialized[];

    try {
      array = JSON.parse(content);
    } catch {
      throw new ParseErrorException();
    }

    return array.map((item) => FileMetadata.reconstitute(item));
  }
}
