import { assertEquals, assertInstanceOf } from '@std/assert';
import { StubDateProvider } from '#shared/domain/date.provider.stub.ts';
import { FileMetadataFakeRepository } from '#file/infrastructure/repository/file-metadata.fake.repository.ts';
import { FileStorageFakeProvider } from '#file/infrastructure/provider/file-storage.fake.provider.ts';
import { UploadFileCommand, UploadFileUseCase } from '#file/application/use-case/command/upload-file.use-case.ts';
import { FileMetadata } from '#file/domain/file-metadata.ts';
import { DownloadFileQuery, DownloadFileUseCase } from '#file/application/use-case/query/download-file.use-case.ts';
import { getFileHash } from '#shared/domain/file-hash.ts';
import { InspectFileQuery, InspectFileUseCase } from '#file/application/use-case/query/inspect-file.use-case.ts';
import { FileStatFakeProvider } from '#file/infrastructure/provider/file-stat.fake.provider.ts';

export const createFileFixture = () => {
  const dateProvider = new StubDateProvider();
  const fileRepository = new FileMetadataFakeRepository();
  const fileStorageProvider = new FileStorageFakeProvider();
  const fileStatProvider = new FileStatFakeProvider();
  const uploadFileUseCase = new UploadFileUseCase(fileRepository, fileStorageProvider, fileStatProvider, dateProvider);
  const inspectFileUseCase = new InspectFileUseCase(fileRepository, dateProvider);
  const downloadFileUseCase = new DownloadFileUseCase(fileRepository, fileStorageProvider, dateProvider);

  let thrownError: Error;
  let filePathDownloaded: string;
  let inspectedFileMetadata: { id: string; name: string; size: number; createdAt: string };

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    givenFileHasSize(filePath: string, size: number) {
      fileStatProvider.addFileSize(filePath, size);
    },
    givenStoredFile(file: FileMetadata) {
      fileRepository.store.set(file.id, file);
    },
    async givenStoredBinaryFile(file: FileMetadata, filePath: string) {
      this.givenStoredFile(file);
      await fileStorageProvider.save(file, filePath);
    },
    whenFileIsSent: async (command: UploadFileCommand) => {
      let fileId = '';

      try {
        fileId = await uploadFileUseCase.handle(command);
      } catch (error) {
        thrownError = error;
      }

      return fileId;
    },
    whenFileIsInspected: async (query: InspectFileQuery) => {
      try {
        inspectedFileMetadata = await inspectFileUseCase.handle(query);
      } catch (error) {
        thrownError = error;
      }
    },
    whenFileIsDownloaded: async (query: DownloadFileQuery) => {
      filePathDownloaded = `${fileStorageProvider.directory}/${query.id}`;
      const file = await Deno.open(filePathDownloaded, { create: true, write: true });

      try {
        const stream = await downloadFileUseCase.handle(query);
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
    thenFileStoredShallBe: (expectedFile: FileMetadata) => {
      assertEquals(expectedFile, fileRepository.store.get(expectedFile.id));
    },
    thenInspectedFileShallBe: (expectedFileData: { id: string; name: string; size: number; createdAt: string }) => {
      assertEquals(expectedFileData, inspectedFileMetadata);
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

export type FileFixture = ReturnType<typeof createFileFixture>;
