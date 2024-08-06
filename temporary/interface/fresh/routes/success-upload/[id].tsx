import { type PageProps } from '$fresh/server.ts';
import { Handlers } from 'https://deno.land/x/fresh@1.6.8/src/server/types.ts';
import { TemporaryFileFileSystemRepository } from '../../../../infrastructure/repository/temporary-file.fs.repository.ts';
import { InspectTemporaryFileQuery, InspectTemporaryFileUseCase } from '../../../../application/use-case/query/inspect-temporary-file.use-case.ts';
import { StubDateProvider } from '../../../../../shared/domain/date.provider.stub.ts';

export const handler: Handlers = {
  async GET(req, ctx) {
    const temporaryFileRepository = new TemporaryFileFileSystemRepository();
    const dateProvider = new StubDateProvider();
    const inspectTemporaryFileUseCase = new InspectTemporaryFileUseCase(temporaryFileRepository, dateProvider);

    const query: InspectTemporaryFileQuery = {
      id: ctx.params.id,
    };

    try {
      const file = await inspectTemporaryFileUseCase.handle(query);
      const url = `/f/${file.id}`;
      return ctx.render({ url, name: file.name });
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
