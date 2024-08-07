import { File } from '../../domain/file.ts';
import { FileRepository } from '../../domain/repository/file.repository.ts';
import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import { NotFoundException, ParseErrorException } from '../../../shared/lib/exceptions.ts';

export class FileFileSystemRepository implements FileRepository {
  constructor(
    public filePath = './file.ts',
  ) {
  }

  async save(file: File): Promise<void> {
    const files = await this.getContent();
    files.push(file);

    const serializedFiles = files.map((temp) => temp.serialize());
    await Deno.writeTextFile(this.filePath, JSON.stringify(serializedFiles), { create: true });
  }

  async get(id: EntityId): Promise<File> {
    const files = await this.getContent();
    const file = files.find((item) => item.id === id);
    if (!file) {
      throw new NotFoundException();
    }

    return file;
  }

  private async getContent(): Promise<File[]> {
    let content: string;
    try {
      content = await Deno.readTextFile(this.filePath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      content = '[]';
    }

    let array: any;

    try {
      array = JSON.parse(content);
    } catch {
      throw new ParseErrorException();
    }

    return array.map((item: Record<string, unknown>) => File.reconstitute(item));
  }
}
