import { Handlers, type PageProps } from '$fresh/server.ts';
import { SendTemporaryFileCommand, SendTemporaryFileUseCase } from '../../../application/use-case/command/send-temporary-file.use-case.ts';
import { TemporaryFileFileSystemProvider } from '../../../infrastructure/temporary-file.fs.provider.ts';
import { StubDateProvider } from '../../../../shared/domain/date.provider.stub.ts';
import { TemporaryStorageFileSystemProvider } from '../../../infrastructure/temporary-storage.fs.provider.ts';

interface Props {
  message: string | null;
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    return await ctx.render({
      message: null,
    });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const file = form.get('my-file') as File;

    if (!file) {
      return ctx.render({
        message: `Please try again`,
      });
    }

    const name = file.name;
    await Deno.writeFile(name, file.stream());

    const temporaryFileProvider = new TemporaryFileFileSystemProvider();
    const temporaryStorageProvider = new TemporaryStorageFileSystemProvider();
    const dateProvider = new StubDateProvider();
    const sendTemporaryFileUseCase = new SendTemporaryFileUseCase(temporaryFileProvider, temporaryStorageProvider, dateProvider);

    const command: SendTemporaryFileCommand = {
      name,
      filePath: `./${name}`,
    };

    const id = await sendTemporaryFileUseCase.handle(command);
    await Deno.remove(name);

    return ctx.render({
      message: `${name} uploaded to url <a href="http://localhost:8000/f/${id}">MON FICHIER</a>!`,
    });
  },
};

export default function Upload(props: PageProps<Props>) {
  const { message } = props.data;
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

        <h1 className='text-4xl font-bold'>Welcome to Fresh</h1>

        <p className='my-4'>
          Try upload your file.
        </p>

        <>
          <form method='post' encType='multipart/form-data'>
            <input type='file' name='my-file' />
            <button type='submit'>Upload</button>
          </form>

          {message ? <p>{message}</p> : null}
        </>
      </div>
    </div>
  );
}
