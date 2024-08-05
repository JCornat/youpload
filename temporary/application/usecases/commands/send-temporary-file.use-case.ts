import {TemporaryFileProvider} from "../../../domain/temporary-file.provider.ts";
import {TemporaryFile} from "../../../domain/temporary-file.ts";
import { TemporaryStorageProvider } from "../../../domain/temporary-storage.provider.ts";
import {DateProvider} from "../../../../shared/domain/date.provider.ts";
import {EntityId} from "../../../../shared/domain/model/entity-id.ts";
import {NotFoundException} from "../../../../shared/lib/exceptions.ts";

export interface SendTemporaryFileCommand {
    name: string;
    filePath: string;
}

export class SendTemporaryFileUseCase {
    constructor(
        private readonly temporaryFileProvider: TemporaryFileProvider,
        private readonly temporaryStorageProvider: TemporaryStorageProvider,
        private readonly dateProvider: DateProvider,
    ) {}

    async handle(sendTemporaryFileCommand: SendTemporaryFileCommand): Promise<EntityId> {
        const filePath = sendTemporaryFileCommand.filePath;
        let stats: Deno.FileInfo;

        try {
            stats = await Deno.lstat(filePath);
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                throw new NotFoundException();
            }

            throw error;
        }

        const createdAt = this.dateProvider.getNow();
        const id = crypto.randomUUID()
        const temporaryFile = TemporaryFile.create({id, name: sendTemporaryFileCommand.name, size: stats.size, createdAt})
        await this.temporaryFileProvider.save(temporaryFile)

        await this.temporaryStorageProvider.save(temporaryFile, filePath)

        return id
    }
}
