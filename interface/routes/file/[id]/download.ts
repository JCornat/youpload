import { Handlers } from '$fresh/src/server/types.ts';
import { InspectFileUseCase } from '@file/application/query/inspect-file.use-case.ts';
import { DownloadFileUseCase } from '@file/application/query/download-file.use-case.ts';

export const handler = {
  async GET(_req, ctx) {
    try {
      const fileMetadata = await new InspectFileUseCase().handle({ id: ctx.params.id });
      const stream = await new DownloadFileUseCase().handle({ id: ctx.params.id });
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
