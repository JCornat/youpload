import { TemporaryFileFileSystemRepository } from '../../../../infrastructure/temporary-file.fs.repository.ts';
import { TemporaryStorageFileSystemProvider } from '../../../../infrastructure/temporary-storage.fs.provider.ts';
import { DownloadTemporaryFileUseCase } from '../../../../application/use-case/query/download-temporary-file.use-case.ts';
import { Handlers } from 'https://deno.land/x/fresh@1.6.8/src/server/types.ts';

export const handler: Handlers = {
  async GET(req, ctx) {
    const temporaryFileRepository = new TemporaryFileFileSystemRepository();
    const temporaryStorageProvider = new TemporaryStorageFileSystemProvider();
    const downloadTemporaryFileUseCase = new DownloadTemporaryFileUseCase(temporaryFileRepository, temporaryStorageProvider);

    const query = {
      id: ctx.params.id,
    };

    try {
      const stream = await downloadTemporaryFileUseCase.handle(query);
      return new Response(stream);
    } catch {
      return new Response('', {
        status: 307,
        headers: { Location: '/file-not-found' },
      });
    }
  },
};
