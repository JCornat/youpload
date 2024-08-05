import { TemporaryFile } from "./temporary-file.ts";
import {TemporaryFileProvider} from "./temporary-file.provider.ts";

export class FakeTemporaryFileProvider implements TemporaryFileProvider {
    sentFile?: TemporaryFile;

    save(temporaryFile: TemporaryFile): Promise<void> {
        this.sentFile = temporaryFile;
        return Promise.resolve();
    }
}