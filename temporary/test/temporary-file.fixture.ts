import { assertEquals, assertInstanceOf } from 'jsr:@std/assert@1';
import { StubDateProvider } from '../../shared/domain/date.provider.stub.ts';
import { TemporaryFileFakeProvider } from '../infra/temporary-file.fake.provider.ts';
import { TemporaryStorageFakeProvider } from '../infra/temporary-storage.fake.provider.ts';
import { SendTemporaryFileCommand, SendTemporaryFileUseCase } from '../application/use-case/command/send-temporary-file.use-case.ts';
import { TemporaryFile } from '../domain/temporary-file.ts';
import { DownloadTemporaryFileQuery, DownloadTemporaryFileUseCase } from '../application/use-case/query/download-temporary-file.use-case.ts';
import { getFileHash } from '../../shared/domain/file-hash.ts';
import { InspectTemporaryFileQuery, InspectTemporaryFileUseCase } from '../application/use-case/query/inspect-temporary-file.use-case.ts';

export const createTemporaryFileFixture = () => {
  const dateProvider = new StubDateProvider();
  const temporaryFileProvider = new TemporaryFileFakeProvider();
  const temporaryStorageProvider = new TemporaryStorageFakeProvider();
  const sendTemporaryFileUseCase = new SendTemporaryFileUseCase(temporaryFileProvider, temporaryStorageProvider, dateProvider);
  const inspectTemporaryFileUseCase = new InspectTemporaryFileUseCase(temporaryFileProvider);
  const downloadTemporaryFileUseCase = new DownloadTemporaryFileUseCase(temporaryFileProvider, temporaryStorageProvider);

  let thrownError: Error;
  let filePathDownloaded: string;
  let inspectedFile: any;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    givenStoredFile(file: TemporaryFile) {
      temporaryFileProvider.store.set(file.id, file);
    },
    async givenBinaryFile(file: TemporaryFile, filePath: string) {
      await temporaryStorageProvider.save(file, filePath);
    },
    whenTemporaryFileIsSent: async (sendTemporaryFileCommand: SendTemporaryFileCommand) => {
      let fileId = '';

      try {
        fileId = await sendTemporaryFileUseCase.handle(sendTemporaryFileCommand);
      } catch (error) {
        thrownError = error;
      }

      return fileId;
    },
    whenTemporaryFileIsInspected: async (inspectTemporaryFileQuery: InspectTemporaryFileQuery) => {
      try {
        inspectedFile = await inspectTemporaryFileUseCase.handle(inspectTemporaryFileQuery);
      } catch (error) {
        thrownError = error;
      }
    },
    whenTemporaryFileIsDownloaded: async (requestTemporaryFileQuery: DownloadTemporaryFileQuery) => {
      filePathDownloaded = `${temporaryStorageProvider.directory}/${requestTemporaryFileQuery.id}`;
      const file = await Deno.open(filePathDownloaded, { create: true, write: true });

      try {
        const stream = await downloadTemporaryFileUseCase.handle(requestTemporaryFileQuery);
        await stream.pipeTo(file.writable);
      } catch (error) {
        thrownError = error;
      }

      try {
        file.close();
      } catch {
        //
      }
    },
    thenFileStoredShallBe: (expectedFile: TemporaryFile) => {
      assertEquals(expectedFile, temporaryFileProvider.store.get(expectedFile.id));
    },
    thenInspectedFileShallBe: (expectedFileData: { id: string; name: string; size: number; createdAt: string }) => {
      assertEquals(expectedFileData, inspectedFile);
    },
    thenDownloadedFileShallBeEqualToFile: async (filePath: string) => {
      const hash1 = await getFileHash(filePath);
      const hash2 = await getFileHash(filePathDownloaded);
      assertEquals(hash1, hash2);
    },
    thenExpectedErrorShallBe: (errorClass: new () => Error) => {
      assertInstanceOf(thrownError, errorClass);
    },
  };
};

export type TemporaryFileFixture = ReturnType<typeof createTemporaryFileFixture>;
