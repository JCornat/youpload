import { assertEquals, assertInstanceOf } from '@std/assert';
import { DateStubProvider } from '@shared/infrastructure/provider/date.stub.provider.ts';
import { FileMetadataFakeRepository } from '@file/infrastructure/repository/file-metadata.fake.repository.ts';
import { FileStorageFakeProvider } from '@file/infrastructure/provider/file-storage.fake.provider.ts';
import { UploadFileCommand, UploadFileUseCase } from '@file/application/command/upload-file.use-case.ts';
import { FileMetadata } from '@file/domain/model/file-metadata.ts';
import { DownloadFileQuery, DownloadFileUseCase } from '@file/application/query/download-file.use-case.ts';
import { getFileHash } from '@file/test/helper/file-hash.ts';
import { InspectFileQuery, InspectFileUseCase } from '@file/application/query/inspect-file.use-case.ts';
import { FileStatFakeProvider } from '@file/infrastructure/provider/file-stat.fake.provider.ts';
import { RemoveExpiredFilesCron } from '@file/application/cron/remove-expired-file.cron.ts';
import { EntityId } from '@shared/domain/model/entity-id.ts';

export const createFileFixture = () => {
  const dateProvider = new DateStubProvider();
  const fileMetadataRepository = new FileMetadataFakeRepository();
  const fileStorageProvider = new FileStorageFakeProvider();
  const fileStatProvider = new FileStatFakeProvider();
  const uploadFileUseCase = new UploadFileUseCase(fileMetadataRepository, fileStorageProvider, fileStatProvider, dateProvider);
  const inspectFileUseCase = new InspectFileUseCase(fileMetadataRepository, dateProvider);
  const downloadFileUseCase = new DownloadFileUseCase(fileMetadataRepository, fileStorageProvider, dateProvider);
  const removeExpiredFilesCron = new RemoveExpiredFilesCron(fileMetadataRepository, fileStorageProvider, dateProvider);

  let thrownError: Error;
  let filePathDownloaded: string;
  let inspectedFileMetadata: FileMetadata;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    givenFileHasSize(filePath: string, size: number) {
      fileStatProvider.addFileSize(filePath, size);
    },
    givenFileMetadata(file: FileMetadata) {
      fileMetadataRepository.store.set(file.id, file);
    },
    async givenFile(fileMetadata: FileMetadata, filePath: string) {
      this.givenFileMetadata(fileMetadata);
      await fileStorageProvider.save(fileMetadata.id, filePath);
    },
    whenFileIsSent: async (command: UploadFileCommand) => {
      let fileId = '';

      try {
        fileId = await uploadFileUseCase.handle(command);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      return fileId;
    },
    whenFileMetadataIsInspected: async (query: InspectFileQuery) => {
      try {
        inspectedFileMetadata = await inspectFileUseCase.handle(query);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }
    },
    whenExpiredFilesAreRemoved: async () => {
      try {
        await removeExpiredFilesCron.execute();
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }
    },
    whenFileIsDownloaded: async (query: DownloadFileQuery) => {
      filePathDownloaded = `${fileStorageProvider.directory}/${query.id}`;
      const file = await Deno.open(filePathDownloaded, { create: true, write: true });

      try {
        const stream = await downloadFileUseCase.handle(query);
        await stream.pipeTo(file.writable);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      try {
        file.close();
      } catch {
        //
      }
    },
    thenFileStoredShallBe: (expectedFileMetadata: FileMetadata) => {
      assertEquals(expectedFileMetadata, fileMetadataRepository.store.get(expectedFileMetadata.id));
    },
    thenInspectedFileShallBe: (expectedFileData: FileMetadata) => {
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
    thenRemainingFilesShouldBe: async (expectedFileMetadataList: FileMetadata[]) => {
      const fileMetadataList = await fileMetadataRepository.getAll();
      assertEquals(fileMetadataList, expectedFileMetadataList);
    },
    thenFollowingStoredFilesShouldBeRemoved: async (expectedFileIds: EntityId[]) => {
      for (const fileId of expectedFileIds) {
        const exists = await fileStorageProvider.exist(fileId);
        assertEquals(exists, false);
      }
    },
    thenFollowingStoredFilesShouldNotBeRemoved: async (expectedFileIds: EntityId[]) => {
      for (const fileId of expectedFileIds) {
        const exists = await fileStorageProvider.exist(fileId);
        assertEquals(exists, true);
      }
    },
  };
};

export type FileFixture = ReturnType<typeof createFileFixture>;
