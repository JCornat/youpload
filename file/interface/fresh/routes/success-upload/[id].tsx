import { type PageProps } from '$fresh/server.ts';
import { Handlers } from '$fresh/src/server/types.ts';
import { FileMetadataFileSystemRepository } from '../../../../infrastructure/repository/file-metadata.fs.repository.ts';
import { InspectFileQuery, InspectFileUseCase } from '../../../../application/use-case/query/inspect-file.use-case.ts';
import { StubDateProvider } from '../../../../../shared/domain/provider/date.provider.stub.ts';

export const handler = {
  async GET(_req, ctx) {
    const fileMetadataRepository = new FileMetadataFileSystemRepository();
    const dateProvider = new StubDateProvider();
    const inspectFileUseCase = new InspectFileUseCase(fileMetadataRepository, dateProvider);

    const query = {
      id: ctx.params.id,
    } satisfies InspectFileQuery;

    try {
      const fileMetadata = await inspectFileUseCase.handle(query);
      const url = `/f/${fileMetadata.id}`;
      return ctx.render({ url, name: fileMetadata.name });
    } catch {
      return new Response('', {
        status: 307,
        headers: { Location: '/file-not-found' },
      });
    }
  },
} satisfies Handlers;

export default function SuccessUpload(props: PageProps<{ url: string }>) {
  const { url } = props.data;

  return (
    <div class='px-4 py-8 mx-auto bg-[#86efac]'>
      <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
        <img
          class='my-6'
          src='/logo.svg'
          width='128'
          height='128'
          alt='the Fresh logo: a sliced lemon dripping with juice'
        />

        <h1 class='text-4xl font-bold'>
          Your file now available at : <a href={url} download>LINK</a>
        </h1>
        <a href='/' class='underline'>Go back home</a>
      </div>
    </div>
  );
}
