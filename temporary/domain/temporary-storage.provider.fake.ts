import { TemporaryFile } from "./temporary-file.ts";
import { TemporaryStorageProvider } from "./temporary-storage.provider.ts";

export class FakeTemporaryStorageProvider implements TemporaryStorageProvider {
    save(temporaryFile: TemporaryFile, filePath: string): Promise<void> {
        return Promise.resolve();
    }
}