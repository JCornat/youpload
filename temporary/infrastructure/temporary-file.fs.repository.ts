import { TemporaryFile } from '../domain/temporary-file.ts';
import { TemporaryFileRepository } from '../domain/temporary-file.repository.ts';
import { EntityId } from '../../shared/domain/model/entity-id.ts';
import { NotFoundException, ParseErrorException } from '../../shared/lib/exceptions.ts';

export class TemporaryFileFileSystemRepository implements TemporaryFileRepository {
  constructor(
    public temporaryFilePath = './temporary-file.ts',
  ) {
  }

  async save(temporaryFile: TemporaryFile): Promise<void> {
    const temporaryFiles = await this.getContent();
    temporaryFiles.push(temporaryFile);

    const z = temporaryFiles.map((temp) => ({ id: temp.id, name: temp.name, size: temp.size, createdAt: temp.createdAt, expireAt: temp.expireAt }));
    await Deno.writeTextFile(this.temporaryFilePath, JSON.stringify(z), { create: true });
  }

  async get(id: EntityId): Promise<TemporaryFile> {
    const temporaryFiles = await this.getContent();
    const temporaryFile = temporaryFiles.find((item) => item.id === id);
    if (!temporaryFile) {
      throw new NotFoundException();
    }

    return temporaryFile;
  }

  private async getContent(): Promise<TemporaryFile[]> {
    let content: string;
    try {
      content = await Deno.readTextFile(this.temporaryFilePath);
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

    return array.map((item: Record<string, unknown>) => TemporaryFile.reconstitute(item));
  }
}