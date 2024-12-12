import { FileMetadata } from '@file/domain/model/file-metadata.ts';
import { FileMetadataRepository } from '@file/domain/repository/file-metadata.repository.ts';
import { EntityId } from '@shared/domain/model/entity-id.ts';
import { NotFoundException, ParseErrorException } from '@shared/lib/exceptions.ts';

export class FileMetadataFileSystemRepository implements FileMetadataRepository {
  constructor(
    public filePath = './config/file-metadata.json',
  ) {}

  async save(fileMetadata: FileMetadata): Promise<void> {
    using file = await this.openFile();
    const fileMetadataList = await this.readFile(file);
    const newContent = [...fileMetadataList, fileMetadata];
    await this.writeFile(newContent, file);
  }

  async get(id: EntityId): Promise<FileMetadata> {
    using file = await this.openFile();
    const fileMetadataList = await this.readFile(file);
    const fileMetadata = fileMetadataList.find((item) => item.id === id);
    if (!fileMetadata) {
      throw new NotFoundException();
    }

    return fileMetadata;
  }

  async getAllExpired(now: Date): Promise<FileMetadata[]> {
    using file = await this.openFile();
    const fileMetadataList = await this.readFile(file);
    return fileMetadataList.filter((fileMetadata: FileMetadata) => fileMetadata.isExpired(now));
  }

  async remove(id: EntityId): Promise<void> {
    using file = await this.openFile();
    const fileMetadataList = await this.readFile(file);
    const filteredFileMetadataList = fileMetadataList.filter((file) => file.id !== id);
    await this.writeFile(filteredFileMetadataList, file);
  }

  private async openFile(): Promise<Deno.FsFile> {
    return await Deno.open(this.filePath, { read: true, write: true, create: true });
  }

  private async readFile(file: Deno.FsFile): Promise<FileMetadata[]> {
    await file.lock(true);
    const fileInfo = await file.stat();
    const buffer = new Uint8Array(fileInfo.size);
    await file.read(buffer);
    const rawContent = new TextDecoder().decode(buffer) || '[]';

    let parsedContent: unknown;

    try {
      parsedContent = JSON.parse(rawContent);
    } catch {
      throw new ParseErrorException();
    }

    if (!Array.isArray(parsedContent)) {
      throw new ParseErrorException();
    }

    return parsedContent.map((item) => FileMetadata.reconstitute(item));
  }

  private async writeFile(fileMetadataList: FileMetadata[], file: Deno.FsFile): Promise<void> {
    await file.seek(0, Deno.SeekMode.Start);
    await file.truncate();
    const serializedFileMetadataList = fileMetadataList.map((fileMetadata) => fileMetadata.toObject());
    await file.write(new TextEncoder().encode(JSON.stringify(serializedFileMetadataList, null, 2)));
  }
}

export const defaultFileMetadataRepository = new FileMetadataFileSystemRepository();
