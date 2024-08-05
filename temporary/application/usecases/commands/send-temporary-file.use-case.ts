import {TemporaryFileProvider} from "../../../domain/temporary-file.provider.ts";
import {TemporaryFile} from "../../../domain/temporary-file.ts";
import { TemporaryStorageProvider } from "../../../domain/temporary-storage.provider.ts";

export interface SendTemporaryFileCommand {
    name: string;
    filePath: string;
}

export class SendTemporaryFileUseCase {
    constructor(
        private readonly temporaryFileProvider: TemporaryFileProvider,
        private readonly temporaryStorageProvider: TemporaryStorageProvider,
    ) {}

    async handle(sendTemporaryFileCommand: SendTemporaryFileCommand) {
        const filePath = sendTemporaryFileCommand.filePath;
        const stats = await Deno.lstat(filePath);

        const createdAt = new Date();
        const id = crypto.randomUUID()
        const temporaryFile = TemporaryFile.create({id, name: sendTemporaryFileCommand.name, size: stats.size, createdAt})
        await this.temporaryFileProvider.save(temporaryFile)

        await this.temporaryStorageProvider.save(temporaryFile, filePath)
    }
}
