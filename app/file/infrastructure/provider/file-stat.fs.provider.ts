import { FileStatProvider } from '@file/domain/provider/file-stat.provider.ts';
import { NotFoundException } from '@shared/lib/exceptions.ts';

export class FileStatFileSystemProvider implements FileStatProvider {
  async getSize(filePath: string): Promise<number> {
    try {
      const stat = await Deno.lstat(filePath);
      return stat.size;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}

export const defaultFileStatProvider = new FileStatFileSystemProvider();
