import { TemporaryFile } from "./temporary-file.ts";
import { TemporaryStorageProvider } from "./temporary-storage.provider.ts";

export class FakeTemporaryStorageProvider implements TemporaryStorageProvider {
    sentFile: any;

    save(temporaryFile: TemporaryFile): Promise<void> {
        throw new Error("Method not implemented.");
    }
}