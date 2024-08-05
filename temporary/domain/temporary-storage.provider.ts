import { TemporaryFile } from './temporary-file.ts';

export interface TemporaryStorageProvider {
  save(temporaryFile: TemporaryFile, filePath: string): Promise<void>;
}
