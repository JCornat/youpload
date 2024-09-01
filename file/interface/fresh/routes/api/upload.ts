import { FreshContext, Handlers } from '$fresh/server.ts';
import { PasswordHashingBcryptRepository } from '../../../../../user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { UserFileSystemRepository } from '../../../../../user/infrastructure/repository/user.fs.repository.ts';
import { SignUpUseCase } from '../../../../../user/application/service/sign-up.use-case.ts';
import { ReferralSlugProvider } from '../../../../../user/infrastructure/provider/referral-slug.provider.ts';
import {FileMetadataFileSystemRepository} from "../../../../infrastructure/repository/file-metadata.fs.repository.ts";
import {FileStorageFileSystemProvider} from "../../../../infrastructure/provider/file-storage.fs.provider.ts";
import {FileStatFileSystemProvider} from "../../../../infrastructure/provider/file-stat.fs.provider.ts";
import {StubDateProvider} from "../../../../../shared/domain/provider/date.provider.stub.ts";
import {UploadFileCommand, UploadFileUseCase} from "../../../../application/use-case/command/upload-file.use-case.ts";

function addHours(date: Date, hours: number) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  date.setTime(date.getTime() + hoursToAdd);
  return date;
}

export const handler: Handlers = {
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
    const amount = form.get('amount') as string;
    const expireAt = addHours(new Date(), +amount);

    if (!file) {
      return new Response(JSON.stringify({ error: 'NOT FILE' }), { status: 500, headers });
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

    return new Response(JSON.stringify({ value: id }), { headers });
  },
};