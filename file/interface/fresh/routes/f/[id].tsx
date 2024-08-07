import { FileMetadataFileSystemRepository } from '../../../../infrastructure/repository/file-metadata.fs.repository.ts';
import { FileStorageFileSystemProvider } from '../../../../infrastructure/provider/file-storage.fs.provider.ts';
import { DownloadFileUseCase } from '../../../../application/use-case/query/download-file.use-case.ts';
import { Handlers } from 'https://deno.land/x/fresh@1.6.8/src/server/types.ts';
import { InspectFileUseCase } from '../../../../application/use-case/query/inspect-file.use-case.ts';
import { StubDateProvider } from '../../../../../shared/domain/date.provider.stub.ts';

export const handler: Handlers = {
  async GET(_req, ctx) {
    const fileMetadataRepository = new FileMetadataFileSystemRepository();
    const fileStorageProvider = new FileStorageFileSystemProvider();
    const dateProvider = new StubDateProvider();
    const inspectFileUseCase = new InspectFileUseCase(fileMetadataRepository, dateProvider);
    const downloadFileUseCase = new DownloadFileUseCase(fileMetadataRepository, fileStorageProvider, dateProvider);

    const query = {
      id: ctx.params.id,
    };

    try {
      const fileMetadata = await inspectFileUseCase.handle(query);
      const stream = await downloadFileUseCase.handle(query);
      return new Response(stream, {
        headers: {
          'Content-Disposition': `attachment; filename="${fileMetadata.name}"`,
        },
      });
    } catch {
      const headers = new Headers();
      headers.set('location', `/file-not-found`);
      return new Response('File not found', {
        status: 404, // See Other
        headers,
      });
    }
  },
};
