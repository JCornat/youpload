import { assertEquals, assertInstanceOf } from 'jsr:@std/assert@1';
import { StubDateProvider } from '../../shared/domain/date.provider.stub.ts';
import { FakeTemporaryFileProvider } from '../domain/temporary-file.provider.fake.ts';
import { FakeTemporaryStorageProvider } from '../domain/temporary-storage.provider.fake.ts';
import { SendTemporaryFileCommand, SendTemporaryFileUseCase } from '../application/use-case/command/send-temporary-file.use-case.ts';
import { TemporaryFile } from '../domain/temporary-file.ts';

export const createTemporaryFileFixture = () => {
  const dateProvider = new StubDateProvider();
  const temporaryFileProvider = new FakeTemporaryFileProvider();
  const temporaryStorageProvider = new FakeTemporaryStorageProvider();
  const sendTemporaryFileUseCase = new SendTemporaryFileUseCase(temporaryFileProvider, temporaryStorageProvider, dateProvider);

  let thrownError: Error;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    whenTemporaryFileIsSent: async (
      sendTemporaryFileCommand: SendTemporaryFileCommand,
    ) => {
      let fileId = '';

      try {
        fileId = await sendTemporaryFileUseCase.handle(
          sendTemporaryFileCommand,
        );
      } catch (error) {
        thrownError = error;
      }

      return fileId;
    },
    thenFileIsStored: (expectedFile: TemporaryFile) => {
      assertEquals(expectedFile, temporaryFileProvider.sentFile);
    },
    thenExpectedErrorShallBe: (errorClass: new () => Error) => {
      assertInstanceOf(thrownError, errorClass);
    },
  };
};

export type TemporaryFileFixture = ReturnType<typeof createTemporaryFileFixture>;
