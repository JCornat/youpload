import {TemporaryFileProvider} from "../../../domain/temporary-file.provider.ts";
import {TemporaryFile} from "../../../domain/temporary-file.ts";

export interface SendTemporaryFileCommand {
    temporaryFile: TemporaryFile;
}

export class SendTemporaryFileUseCase {
    constructor(
        private readonly temporaryFileProvider: TemporaryFileProvider,
    ) {}

    async handle(sendTemporaryFileCommand: SendTemporaryFileCommand) {
        await this.temporaryFileProvider.save(sendTemporaryFileCommand.temporaryFile)
    }
}
