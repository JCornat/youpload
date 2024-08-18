import { FileMetadataFileSystemRepository } from '../../../infrastructure/repository/file-metadata.fs.repository.ts';
import { FileStorageFileSystemProvider } from '../../../infrastructure/provider/file-storage.fs.provider.ts';
import { StubDateProvider } from '../../../../shared/domain/provider/date.provider.stub.ts';
import { UploadFileCommand, UploadFileUseCase } from '../../../application/use-case/command/upload-file.use-case.ts';
import { Handlers } from '$fresh/server.ts';
import { FileStatFileSystemProvider } from '../../../infrastructure/provider/file-stat.fs.provider.ts';
import { getCookies } from '@std/http/cookie';
import { PageProps } from '$fresh/server.ts';

interface Data {
  isAllowed: boolean;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    console.log(cookies);
    return await ctx.render({ isAllowed: cookies.auth === 'bar' });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const file = form.get('my-file') as File;
    const amount = form.get('amount') as string;
    const expireAt = addHours(new Date(), +amount);

    function addHours(date: Date, hours: number) {
      const hoursToAdd = hours * 60 * 60 * 1000;
      date.setTime(date.getTime() + hoursToAdd);
      return date;
    }

    if (!file) {
      return ctx.render({
        message: `Please try again`,
      });
    }

    const name = file.name;
    await Deno.writeFile(name, file.stream());

    const fileMetadataRepository = new FileMetadataFileSystemRepository();
    const fileStorageProvider = new FileStorageFileSystemProvider();
    const fileStatProvider = new FileStatFileSystemProvider();
    const dateProvider = new StubDateProvider();
    const uploadFileUseCase = new UploadFileUseCase(fileMetadataRepository, fileStorageProvider, fileStatProvider, dateProvider);

    const command: UploadFileCommand = {
      name,
      filePath: `./${name}`,
      expireAt,
    };

    const id = await uploadFileUseCase.handle(command);
    await Deno.remove(name);

    const headers = new Headers();
    headers.set('location', `/file/${id}`);
    return new Response(null, {
      status: 303, // See Other
      headers,
    });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <>
      <div class='px-4 py-8 mx-auto bg-[#86efac]'>
        <div class='flex justify-end'>
          <a href='/sign-in'>Login</a>
        </div>

        <div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
          <img
            class='my-6'
            src='/logo.svg'
            width='128'
            height='128'
            alt='the Fresh logo: a sliced lemon dripping with juice'
          />
          <h1 class='text-4xl font-bold'>Welcome to Fresh</h1>

          You currently {data.isAllowed ? 'are' : 'are not'} logged in.
          <>
            <form method='post' encType='multipart/form-data'>
              <input type='number' name='amount' value='1' />
              <br />
              <input type='file' name='my-file' />
              <br />
              <button type='submit'>Upload</button>
            </form>
          </>
        </div>
      </div>
    </>
  );
}

function Login() {
  return (
    <form method='post' action='/api/login'>
      <input type='text' name='username' />
      <input type='password' name='password' />
      <button type='submit'>Submit</button>
    </form>
  );
}
