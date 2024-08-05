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
    const data= '';

    await Deno.writeTextFile(this.temporaryFilePath, JSON.stringify(data), {create:true})
  }

  async get(id: EntityId): Promise<TemporaryFile> {
    const x = await this.getContent();
    const z = JSON.parse(x);

    if (!temporaryFile) {
      throw new NotFoundException();
    }

    const content = await Deno.readTextFile(this.temporaryFilePath);
  }

  private async getContent(): Promise<string> {
    try {
      return await Deno.readTextFile(this.temporaryFilePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return '{}';
      }

      throw error
    }

  }
}
