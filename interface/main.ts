/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import '@std/dotenv';

import { start } from '$fresh/server.ts';
import manifest from './fresh.gen.ts';
import config from './fresh.config.ts';
import { FileMetadataFileSystemRepository } from '../app/file/infrastructure/repository/file-metadata.fs.repository.ts';
import { FileStorageFileSystemProvider } from '../app/file/infrastructure/provider/file-storage.fs.provider.ts';
import { DateStubProvider } from '../app/shared/infrastructure/provider/date.stub.provider.ts';
import { RemoveExpiredFilesCron } from '../app/file/application/cron/remove-expired-file.cron.ts';

const isBuildMode = Deno.args.includes('build');
if (!isBuildMode) {
  Deno.cron('Remove expired files cron job', '* * * * *', () => {
    const fileMetadataRepository = new FileMetadataFileSystemRepository();
    const fileStorageProvider = new FileStorageFileSystemProvider();
    const dateProvider = new DateStubProvider();
    const removeExpiredFilesCron = new RemoveExpiredFilesCron(fileMetadataRepository, fileStorageProvider, dateProvider);
    removeExpiredFilesCron.execute();
  });
}

await start(manifest, config);
