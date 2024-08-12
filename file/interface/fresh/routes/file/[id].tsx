import { type PageProps } from '$fresh/server.ts';
import { Handlers } from '$fresh/src/server/types.ts';
import { FileMetadataFileSystemRepository } from '../../../../infrastructure/repository/file-metadata.fs.repository.ts';
import { InspectFileQuery, InspectFileUseCase } from '../../../../application/use-case/query/inspect-file.use-case.ts';
import { StubDateProvider } from '../../../../../shared/domain/provider/date.provider.stub.ts';
import { format as formatDate } from '@std/datetime';
import { format as formatBytes } from '@std/fmt/bytes';

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
      const url = `/file/${fileMetadata.id}/download`;
      return ctx.render({
        url,
        name: fileMetadata.name.value,
        size: formatBytes(fileMetadata.size.value, { locale: 'fr' }),
        createdAt: formatDate(fileMetadata.createdAt, 'dd/MM/yyyy'),
        expireAt: formatDate(fileMetadata.expireAt, 'dd/MM/yyyy'),
      });
    } catch {
      return new Response('', {
        status: 307,
        headers: { Location: '/file-not-found' },
      });
    }
  },
};

export default function FileDetail(props: PageProps<{ url: string; name: string; size: string; createdAt: string; expireAt: string }>) {
  const { url, name, size, createdAt, expireAt } = props.data;

  return (
    <div className='px-4 py-8 mx-auto bg-[#86efac]'>
      <div className='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
        <a href='/'>
          <img
            className='my-6'
            src='/logo.svg'
            width='128'
            height='128'
            alt='the Fresh logo: a sliced lemon dripping with juice'
          />
        </a>

        <h1 className='text-4xl font-bold'>
          {name}
        </h1>

        <p>Size : {size}</p>
        <p>Created at : {createdAt}</p>
        <p>Expire at : {expireAt}</p>

        <a href={url} download>Download</a>
      </div>
    </div>
  );
}
