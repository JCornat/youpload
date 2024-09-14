import { FreshContext, Handlers } from '$fresh/server.ts';
import { FileMetadataFileSystemRepository } from '../../../../infrastructure/repository/file-metadata.fs.repository.ts';
import { FileStorageFileSystemProvider } from '../../../../infrastructure/provider/file-storage.fs.provider.ts';
import { FileStatFileSystemProvider } from '../../../../infrastructure/provider/file-stat.fs.provider.ts';
import { DateStubProvider } from '../../../../../shared/infrastructure/provider/date.stub.provider.ts';
import { UploadFileCommand, UploadFileUseCase } from '../../../../application/use-case/command/upload-file.use-case.ts';

function addHours(date: Date, hours: number) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  date.setTime(date.getTime() + hoursToAdd);
  return date;
}

export const handler = {
  async POST(req: Request, ctx: FreshContext) {
    const headers = new Headers();
    headers.set('Content-Type', `application/json`);

    let form: FormData;
    try {
      form = await req.formData();
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }

    const file = form.get('file') as File;
    const amount = +(form.get('amount') as string);
    const allowedAmounts = [1, 24, 24 * 7];
    if (!allowedAmounts.includes(amount)) {
      return new Response(JSON.stringify({ error: 'BAD AMOUNT' }), { status: 400, headers });
    }

    const expireAt = addHours(new Date(), amount);

    if (!file) {
      return new Response(JSON.stringify({ error: 'NO FILE' }), { status: 500, headers });
    }

    const maxFileSize = 10 * 1000 * 1000;
    if (!ctx.state.isLoggedIn && file.size > maxFileSize) {
      return new Response(JSON.stringify({ error: 'FILE SIZE EXCEEDED' }), { status: 400, headers });
    }

    const name = file.name;
    await Deno.writeFile(name, file.stream());

    const fileMetadataRepository = new FileMetadataFileSystemRepository();
    const fileStorageProvider = new FileStorageFileSystemProvider();
    const fileStatProvider = new FileStatFileSystemProvider();
    const dateProvider = new DateStubProvider();
    const uploadFileUseCase = new UploadFileUseCase(fileMetadataRepository, fileStorageProvider, fileStatProvider, dateProvider);

    const command = {
      name,
      filePath: `./${name}`,
      expireAt,
    } satisfies UploadFileCommand;

    const id = await uploadFileUseCase.handle(command);
    await Deno.remove(name);

    return new Response(JSON.stringify({ value: id }), { headers });
  },
} satisfies Handlers;
