import { assertEquals } from "jsr:@std/assert@1";
import { afterEach, beforeEach, describe, it } from "jsr:@std/testing@0.224.0/bdd";
import {SendTemporaryFileCommand, SendTemporaryFileUseCase} from "./send-temporary-file.use-case.ts";
import {FakeTemporaryFileProvider} from "../../../domain/temporary-file.provider.fake.ts";
import { TemporaryFile } from "../../../domain/temporary-file.ts";

describe('Feature: Send temporary file', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  })

  it('should save a valid temporary file', async () => {
    const temporaryFile = temporaryFileBuilder().withName('test.jpg').build();
    const sendTemporaryFileCommand: SendTemporaryFileCommand = {
      temporaryFile,
    }

    await fixture.whenTemporaryFileIsSent(sendTemporaryFileCommand);

    const expectedFile = {}
    fixture.thenFileIsStored(expectedFile)
  })
})

export const createFixture = () => {
  const temporaryFileProvider = new FakeTemporaryFileProvider();
  const sendTemporaryFileUseCase = new SendTemporaryFileUseCase(temporaryFileProvider)
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
  id = '0',
  name = 'coucou.jpg',
  size = 100,
}: {
  id?: string,
  name?: string,
  size?: number,
} = {}) => {
  const props = {id, name, size}

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
    build() {
      return TemporaryFile.create(props);
    },
  }
}
