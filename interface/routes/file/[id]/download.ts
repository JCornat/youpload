import { Handlers } from '$fresh/src/server/types.ts';
import { defaultInspectFileUseCase } from '../../../../app/file/application/query/inspect-file.use-case.ts';
import { defaultDownloadFileUseCase } from '../../../../app/file/application/query/download-file.use-case.ts';

export const handler = {
  async GET(_req, ctx) {
    const inspectFileUseCase = defaultInspectFileUseCase;
    const downloadFileUseCase = defaultDownloadFileUseCase;

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
