import { assertEquals, assertInstanceOf } from 'jsr:@std/assert@1';
import { StubDateProvider } from '../../shared/domain/date.provider.stub.ts';
import { TemporaryFileFakeRepository } from '../infrastructure/temporary-file.fake.repository.ts';
import { TemporaryStorageFakeProvider } from '../infrastructure/temporary-storage.fake.provider.ts';
import { SendTemporaryFileCommand, SendTemporaryFileUseCase } from '../application/use-case/command/send-temporary-file.use-case.ts';
import { TemporaryFile } from '../domain/temporary-file.ts';
import { DownloadTemporaryFileQuery, DownloadTemporaryFileUseCase } from '../application/use-case/query/download-temporary-file.use-case.ts';
import { getFileHash } from '../../shared/domain/file-hash.ts';
import { InspectTemporaryFileQuery, InspectTemporaryFileUseCase } from '../application/use-case/query/inspect-temporary-file.use-case.ts';
import { FileStatFakeProvider } from '../infrastructure/file-stat.fake.provider.ts';

export const createTemporaryFileFixture = () => {
  const dateProvider = new StubDateProvider();
  const temporaryFileRepository = new TemporaryFileFakeRepository();
  const temporaryStorageProvider = new TemporaryStorageFakeProvider();
  const fileStatProvider = new FileStatFakeProvider();
  const sendTemporaryFileUseCase = new SendTemporaryFileUseCase(temporaryFileRepository, temporaryStorageProvider, fileStatProvider, dateProvider);
  const inspectTemporaryFileUseCase = new InspectTemporaryFileUseCase(temporaryFileRepository, dateProvider);
  const downloadTemporaryFileUseCase = new DownloadTemporaryFileUseCase(temporaryFileRepository, temporaryStorageProvider, dateProvider);

  let thrownError: Error;
  let filePathDownloaded: string;
  let inspectedFile: any;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    givenFileHasSize(filePath: string, size: number) {
      fileStatProvider.addFileSize(filePath, size);
    },
    givenStoredFile(file: TemporaryFile) {
      temporaryFileRepository.store.set(file.id, file);
    },
    async givenStoredBinaryFile(file: TemporaryFile, filePath: string) {
      this.givenStoredFile(file);
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
      assertEquals(expectedFile, temporaryFileRepository.store.get(expectedFile.id));
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
