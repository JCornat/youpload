import { beforeAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { FileStorageFileSystemProvider } from './file-storage.fs.provider.ts';
import { fileBuilder } from '../../test/file.builder.ts';
import { assertExists, assertInstanceOf, unreachable } from 'jsr:@std/assert@1';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';

describe('FileStorageFileSystemProvider', () => {
  let fileStorageProvider: FileStorageFileSystemProvider;

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
    fileStorageProvider = new FileStorageFileSystemProvider('./temporary/test/file/tmp');
  });

  describe('save', () => {
    it(`shall return an error is file doesn't exist`, async () => {
      const file = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-05 08:00:00'))
        .build();

      try {
        await fileStorageProvider.save(file, './temporary/test/file/404.txt');
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall save a file', async () => {
      const file = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-05 08:00:00'))
        .build();

      await fileStorageProvider.save(file, './temporary/test/file/test.txt');

      try {
        const fileStat = await Deno.lstat(`./temporary/test/file/tmp/${file.id}`);
        assertExists(fileStat);
      } catch {
        unreachable();
      }
    });
  });

  describe('getStream', () => {
    it(`shall not stream and return an error is file doesn't exist`, async () => {
      const id = crypto.randomUUID();

      try {
        await fileStorageProvider.getStream(id);
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall get a stream for valid file', async () => {
      const id = crypto.randomUUID();
      await Deno.copyFile('./temporary/test/file/test.txt', `./temporary/test/file/tmp/${id}`);

      const stream = await fileStorageProvider.getStream(id);
      assertInstanceOf(stream, ReadableStream);
      await stream.cancel();
    });
  });
});
