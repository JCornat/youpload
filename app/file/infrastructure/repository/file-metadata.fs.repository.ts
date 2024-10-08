import { FileMetadata } from '../../domain/model/file-metadata.ts';
import { FileMetadataRepository } from '../../domain/repository/file-metadata.repository.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { NotFoundException, ParseErrorException } from '../../../shared/lib/exceptions.ts';

export class FileMetadataFileSystemRepository implements FileMetadataRepository {
  constructor(
    public filePath = './config/file-metadata.json',
  ) {}

  async save(fileMetadata: FileMetadata): Promise<void> {
    const fileMetadataList = await this.getContent();
    fileMetadataList.push(fileMetadata);

    const serializedFiles = fileMetadataList.map((temp) => temp.toObject());
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

    let array: any[];

    try {
      array = JSON.parse(content);
    } catch (error) {
      console.log(error);
      throw new ParseErrorException();
    }

    return array.map((item) => FileMetadata.reconstitute(item));
  }

  async getAllExpired(now: Date): Promise<FileMetadata[]> {
    const fileMetadataList = await this.getContent();
    return fileMetadataList.filter((fileMetadata: FileMetadata) => fileMetadata.isExpired(now));
  }

  async remove(id: EntityId): Promise<void> {
    const files = await this.getContent();
    const updatedFiles = files.filter((file) => file.id !== id);

    const serializedFiles = updatedFiles.map((temp) => temp.toObject());
    await Deno.writeTextFile(this.filePath, JSON.stringify(serializedFiles), { create: true });
  }
}
