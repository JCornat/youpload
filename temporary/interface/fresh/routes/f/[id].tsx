import { TemporaryFileFileSystemRepository } from '../../../../infrastructure/temporary-file.fs.repository.ts';
import { TemporaryStorageFileSystemProvider } from '../../../../infrastructure/temporary-storage.fs.provider.ts';
import { DownloadTemporaryFileUseCase } from '../../../../application/use-case/query/download-temporary-file.use-case.ts';
import { Handlers } from 'https://deno.land/x/fresh@1.6.8/src/server/types.ts';
import { InspectTemporaryFileUseCase } from '../../../../application/use-case/query/inspect-temporary-file.use-case.ts';
import { StubDateProvider } from '../../../../../shared/domain/date.provider.stub.ts';

export const handler: Handlers = {
  async GET(req, ctx) {
    const temporaryFileRepository = new TemporaryFileFileSystemRepository();
    const temporaryStorageProvider = new TemporaryStorageFileSystemProvider();
    const dateProvider = new StubDateProvider();
    const inspectTemporaryFileUseCase = new InspectTemporaryFileUseCase(temporaryFileRepository, dateProvider);
    const downloadTemporaryFileUseCase = new DownloadTemporaryFileUseCase(temporaryFileRepository, temporaryStorageProvider, dateProvider);

    const query = {
      id: ctx.params.id,
    };

    try {
      const file = await inspectTemporaryFileUseCase.handle(query);
      const stream = await downloadTemporaryFileUseCase.handle(query);
      return new Response(stream, {
        headers: {
          'Content-Disposition': `attachment; filename="${file.name}"`,
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
