import {TemporaryFileFileSystemRepository} from "../../../infrastructure/temporary-file.fs.repository.ts";
import {TemporaryStorageFileSystemProvider} from "../../../infrastructure/temporary-storage.fs.provider.ts";
import {StubDateProvider} from "../../../../shared/domain/date.provider.stub.ts";
import {SendTemporaryFileCommand, SendTemporaryFileUseCase} from "../../../application/use-case/command/send-temporary-file.use-case.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    return await ctx.render();
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

    const temporaryFileRepository = new TemporaryFileFileSystemRepository();
    const temporaryStorageProvider = new TemporaryStorageFileSystemProvider();
    const dateProvider = new StubDateProvider();
    const sendTemporaryFileUseCase = new SendTemporaryFileUseCase(temporaryFileRepository, temporaryStorageProvider, dateProvider);

    const command: SendTemporaryFileCommand = {
      name,
      filePath: `./${name}`,
      expireAt,
    };

    const id = await sendTemporaryFileUseCase.handle(command);
    await Deno.remove(name);

    const headers = new Headers();
    headers.set("location", `/success-upload/${id}`);
    return new Response(null, {
      status: 303, // See Other
      headers,
    });
  },
};

export default function Home() {
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
        <h1 class='text-4xl font-bold'>Welcome to Fresh</h1>

        <>
          <form method='post' encType='multipart/form-data'>
            <input type='number' name='amount' value="1"/>
            <br/>
            <input type='file' name='my-file'/>
            <br/>
            <button type='submit'>Upload</button>
          </form>
        </>
      </div>
    </div>
  );
}