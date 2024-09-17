import { FileMetadataFileSystemRepository } from '../../../../app/file/infrastructure/repository/file-metadata.fs.repository.ts';
import { FileStorageFileSystemProvider } from '../../../../app/file/infrastructure/provider/file-storage.fs.provider.ts';
import { DownloadFileUseCase } from '../../../../app/file/application/use-case/query/download-file.use-case.ts';
import { Handlers } from '$fresh/src/server/types.ts';
import { InspectFileUseCase } from '../../../../app/file/application/use-case/query/inspect-file.use-case.ts';
import { DateStubProvider } from '../../../../app/shared/infrastructure/provider/date.stub.provider.ts';

export const handler = {
  async GET(_req, ctx) {
    const fileMetadataRepository = new FileMetadataFileSystemRepository();
    const fileStorageProvider = new FileStorageFileSystemProvider();
    const dateProvider = new DateStubProvider();
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
          'Content-Disposition': `attachment; filename="${fileMetadata.name.value}"`,
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
} satisfies Handlers;
