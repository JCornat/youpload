import { type PageProps } from '$fresh/server.ts';
import { Handlers } from '$fresh/src/server/types.ts';
import { FileMetadataFileSystemRepository } from '../../../../infrastructure/repository/file-metadata.fs.repository.ts';
import { InspectFileQuery, InspectFileUseCase } from '../../../../application/use-case/query/inspect-file.use-case.ts';
import { StubDateProvider } from '../../../../../shared/domain/provider/date.provider.stub.ts';
import { format as formatDate } from '@std/datetime';
import { format as formatBytes } from '@std/fmt/bytes';
import Header from '../../components/header.tsx';
import Button from '../../components/button.tsx';
import Footer from '../../components/footer.tsx';
import FileCopyLinkButton from '../../islands/file/copy-link-button.tsx';
import FileDownloadLinkButton from '../../islands/file/download-link-button.tsx';

interface Data {
  url: string;
  name: string;
  size: string;
  createdAt: string;
  expireAt: string;
  isLoggedIn?: boolean;
}

export const handler = {
  async GET(_req, ctx) {
    const fileMetadataRepository = new FileMetadataFileSystemRepository();
    const dateProvider = new StubDateProvider();
    const inspectFileUseCase = new InspectFileUseCase(fileMetadataRepository, dateProvider);

    const query = {
      id: ctx.params.id,
    } as InspectFileQuery;

    try {
      const fileMetadata = await inspectFileUseCase.handle(query);
      const url = `${ctx.url.origin}/file/${fileMetadata.id}/download`;
      return ctx.render({
        url,
        name: fileMetadata.name.value,
        size: formatBytes(fileMetadata.size.value, { locale: 'fr' }),
        createdAt: formatDate(fileMetadata.createdAt, 'dd/MM/yyyy'),
        expireAt: formatDate(fileMetadata.expireAt, 'dd/MM/yyyy, HH:mm'),
        isLoggedIn: ctx.state.isLoggedIn,
      });
    } catch {
      return new Response('', {
        status: 307,
        headers: { Location: '/file-not-found' },
      });
    }
  },
} satisfies Handlers;

const copyLink = () => {
  console.log('???');
  // navigator.clipboard['writeText']('this.input');
};

export default function FileDetail(props: PageProps<Data>) {
  const { url, name, size, createdAt, expireAt, isLoggedIn } = props.data;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />

      <div class={'mx-auto px-4 flex flex-col items-center justify-center'}>
        <a href='/'>
          <img
            class='my-6'
            src='/logo.svg'
            width='128'
            height='128'
            alt='the Fresh logo: a sliced lemon dripping with juice'
          />
        </a>

        <h1 class='text-3xl font-bold mb-8 text-center text-slate-700'>
          Download your <span class={'text-blue-600'}>file</span>
        </h1>
      </div>

      <div className='mb-32'>
        <div class='flex flex-col md:flex-row mx-auto px-4 md:px-8 lg:px-16 justify-center'>
          <div class='flex items-center justify-center w-full bg-[url(images/bg-blue.jpg)] bg-blue-600 lg:max-w-xl bg-cover p-8 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow ease-in-out duration-300 z-10 relative overflow-hidden'>
            <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center pt-5 pb-6 px-4'>
              <span class='material-symbols-outlined opacity-20 text-[7rem]'>cloud_download</span>
              <div class='text-xl text-center font-semibold leading-5 break-all'>{name}</div>
              <div class='text-md text-center opacity-70'>{size}</div>
            </div>
          </div>

          <div
            class={'border border-gray-300 border-1 bg-indigo-50 overflow-hidden flex flex-col relative -mt-4 mx-6 md:-ml-2 md:mr-0 md:my-8 p-4 pt-8 md:p-8 md:pl-10 shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300 rounded-xl md:min-w-[25rem] bg-white/30'}
          >
            <FileCopyLinkButton payload={url} />
            <div class={'flex-auto'}></div>
            <h3 class='mb-2 font-medium text-slate-700 text-center'>
              Expires at <span class={'font-semibold'}>{expireAt}</span>
            </h3>
            <FileDownloadLinkButton url={url} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
