import { assertEquals } from "jsr:@std/assert@1";
import { beforeEach, describe, it } from "jsr:@std/testing@0.224.0/bdd";
import {SendTemporaryFileCommand, SendTemporaryFileUseCase} from "./send-temporary-file.use-case.ts";
import {FakeTemporaryFileProvider} from "../../../domain/temporary-file.provider.fake.ts";
import { TemporaryFile } from "../../../domain/temporary-file.ts";
import { FakeTemporaryStorageProvider } from "../../../domain/temporary-storage.provider.fake.ts";

describe('Feature: Send temporary file', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  })

  it('should save a valid temporary file', async () => {
    const sendTemporaryFileCommand: SendTemporaryFileCommand = {
      name: 'coucou',
      filePath: './test.txt'
    }

    await fixture.whenTemporaryFileIsSent(sendTemporaryFileCommand);

    const expectedFile = {
      name: 'coucou',
      size: 40,
    }

    fixture.thenFileIsStored(expectedFile)
  })
})

export const createFixture = () => {
  const temporaryFileProvider = new FakeTemporaryFileProvider();
  const temporaryStorageProvider = new FakeTemporaryStorageProvider();
  const sendTemporaryFileUseCase = new SendTemporaryFileUseCase(temporaryFileProvider, temporaryStorageProvider);
  let thrownError: Error;

  return {
    whenTemporaryFileIsSent: async (sendTemporaryFileCommand: SendTemporaryFileCommand) => {
      try {
        await sendTemporaryFileUseCase.handle(sendTemporaryFileCommand)
      } catch (error) {
        thrownError = error;
      }
    },
    thenFileIsStored: (expectedFile: any) => {
      assertEquals(expectedFile, temporaryFileProvider.sentFile)
    }
  }
}

export type Fixture = ReturnType<typeof createFixture>;

export const temporaryFileBuilder = ({
  id = 'MON-UUID-V4',
  name = 'coucou.txt',
  size = 100,
  createdAt = new Date(),
}: {
  id?: string,
  name?: string,
  size?: number,
  createdAt?: Date,
} = {}) => {
  const props = {id, name, size, createdAt}

  return {
    withId(_id: string) {
      return temporaryFileBuilder({...props, id: _id})
    },
    withName(_name: string) {
      return temporaryFileBuilder({...props, name: _name})
    },
    withSize(_size: number) {
      return temporaryFileBuilder({...props, size: _size})
    },
    withCreatedAt(_createdAt: Date) {
      return temporaryFileBuilder({...props, createdAt: _createdAt})
    },
    build() {
      return TemporaryFile.create(props);
    },
  }
}
