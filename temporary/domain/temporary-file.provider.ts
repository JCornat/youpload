import { TemporaryFile } from './temporary-file.ts';

export interface TemporaryFileProvider {
  save(temporaryFile: TemporaryFile): Promise<void>;
}
