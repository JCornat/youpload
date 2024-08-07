import { FileStatProvider } from 'file/domain/provider/file-stat.provider.ts';
import { NotFoundException } from 'shared/lib/exceptions.ts';

export class FileStatFakeProvider implements FileStatProvider {
  private list = new Map<string, number>();

  getSize(filePath: string): Promise<number> {
    const size = this.list.get(filePath);
    if (!size) {
      throw new NotFoundException();
    }

    return Promise.resolve(size);
  }

  addFileSize(filePath: string, size: number) {
    this.list.set(filePath, size);
  }
}
