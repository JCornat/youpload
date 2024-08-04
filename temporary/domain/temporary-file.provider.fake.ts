import { TemporaryFile } from "./temporary-file.ts";
import {TemporaryFileProvider} from "./temporary-file.provider.ts";

export class FakeTemporaryFileProvider implements TemporaryFileProvider {
    sentFile: any;

    save(temporaryFile: TemporaryFile): Promise<void> {
        throw new Error("Method not implemented.");
    }
}