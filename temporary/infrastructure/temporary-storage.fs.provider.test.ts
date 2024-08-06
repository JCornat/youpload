import { beforeAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { TemporaryStorageFileSystemProvider } from './temporary-storage.fs.provider.ts';
import { temporaryFileBuilder } from '../test/temporary-file.builder.ts';
import { assertExists, assertInstanceOf, unreachable } from 'jsr:@std/assert@1';
import { NotFoundException } from '../../shared/lib/exceptions.ts';

describe('TemporaryStorageFileSystemProvider', () => {
  let temporaryStorageProvider: TemporaryStorageFileSystemProvider;

  beforeAll(async () => {
    try {
      await Deno.remove('./temporary/test/file/tmp', { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    await Deno.mkdir('./temporary/test/file/tmp');
  });

  beforeEach(() => {
    temporaryStorageProvider = new TemporaryStorageFileSystemProvider('./temporary/test/file/tmp');
  });

  describe('save', () => {
    it(`shall return an error is file doesn't exist`, async () => {
      const temporaryFile = temporaryFileBuilder()
        .withId(`${crypto.randomUUID()}.txt`)
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-05 08:00:00'))
        .build();

      try {
        await temporaryStorageProvider.save(temporaryFile, './temporary/test/file/404.txt');
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall save a file', async () => {
      const temporaryFile = temporaryFileBuilder()
        .withId(`${crypto.randomUUID()}.txt`)
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-05 08:00:00'))
        .build();

      await temporaryStorageProvider.save(temporaryFile, './temporary/test/file/test.txt');

      try {
        const file = await Deno.lstat(`./temporary/test/file/tmp/${temporaryFile.id}`);
        assertExists(file);
      } catch {
        unreachable();
      }
    });
  });

  describe('getStream', () => {
    it(`shall not stream and return an error is file doesn't exist`, async () => {
      const id = `${crypto.randomUUID()}.txt`;

      try {
        await temporaryStorageProvider.getStream(id);
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall get a stream for valid file', async () => {
      const id = `${crypto.randomUUID()}.txt`;
      await Deno.copyFile('./temporary/test/file/test.txt', `./temporary/test/file/tmp/${id}`);

      const stream = await temporaryStorageProvider.getStream(id);
      assertInstanceOf(stream, ReadableStream);
      await stream.cancel();
    });
  });
});
