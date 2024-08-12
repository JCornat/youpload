import { type PageProps } from '$fresh/server.ts';
import { Handlers } from '$fresh/src/server/types.ts';
import { FileMetadataFileSystemRepository } from '../../../../infrastructure/repository/file-metadata.fs.repository.ts';
import { InspectFileQuery, InspectFileUseCase } from '../../../../application/use-case/query/inspect-file.use-case.ts';
import { StubDateProvider } from '../../../../../shared/domain/provider/date.provider.stub.ts';

export const handler: Handlers = {
  async GET(_req, ctx) {
    const fileMetadataRepository = new FileMetadataFileSystemRepository();
    const dateProvider = new StubDateProvider();
    const inspectFileUseCase = new InspectFileUseCase(fileMetadataRepository, dateProvider);

    const query: InspectFileQuery = {
      id: ctx.params.id,
    };

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
};

export default function SuccessUpload(props: PageProps<{ url: string }>) {
  const { url } = props.data;

  return (
    <div className='px-4 py-8 mx-auto bg-[#86efac]'>
      <div className='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
        <img
          className='my-6'
          src='/logo.svg'
          width='128'
          height='128'
          alt='the Fresh logo: a sliced lemon dripping with juice'
        />

        <h1 className='text-4xl font-bold'>
          Your file now available at : <a href={url} download>LINK</a>
        </h1>
        <a href='/' className='underline'>Go back home</a>
      </div>
    </div>
  );
}
