import { TemporaryFile } from '../domain/temporary-file.ts';
import { TemporaryFileProvider } from './temporary-file.provider.ts';
import { EntityId } from '../../shared/domain/model/entity-id.ts';
import { NotFoundException } from '../../shared/lib/exceptions.ts';

export class TemporaryFileFileSystemProvider implements TemporaryFileProvider {
  constructor(
    private readonly temporaryFilePath = './temporary-file.ts',
  ) {
  }

  async save(temporaryFile: TemporaryFile): Promise<void> {
    const temporaryFiles = await this.getContent();
    temporaryFiles.push(temporaryFile);

    await Deno.writeTextFile(this.temporaryFilePath, JSON.stringify(temporaryFiles), { create: true });
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

    const array = JSON.parse(content);
    return array.map((item: Record<string, unknown>) => TemporaryFile.reconstitute(item));
  }
}
