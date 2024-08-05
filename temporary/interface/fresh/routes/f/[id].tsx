import { TemporaryFileFileSystemProvider } from '../../../../infrastructure/temporary-file.fs.provider.ts';
import { TemporaryStorageFileSystemProvider } from '../../../../infrastructure/temporary-storage.fs.provider.ts';
import { DownloadTemporaryFileUseCase } from '../../../../application/use-case/query/download-temporary-file.use-case.ts';
import { Handlers } from 'https://deno.land/x/fresh@1.6.8/src/server/types.ts';

interface Props {
  message: string | null;
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const temporaryFileProvider = new TemporaryFileFileSystemProvider();
    const temporaryStorageProvider = new TemporaryStorageFileSystemProvider();
    const downloadTemporaryFileUseCase = new DownloadTemporaryFileUseCase(temporaryFileProvider, temporaryStorageProvider);

    const query = {
      id: ctx.params.id,
    };

    const stream = await downloadTemporaryFileUseCase.handle(query);
    return new Response(stream);
  },
};
