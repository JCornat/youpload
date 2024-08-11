import { beforeAll, beforeEach, describe, it } from '@std/testing/bdd';
import { FileStorageFileSystemProvider } from './file-storage.fs.provider.ts';
import { fileMetadataBuilder } from '../../test/file-metadata.builder.ts';
import { assertExists, assertInstanceOf, unreachable } from '@std/assert';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';

describe('FileStorageFileSystemProvider', () => {
  let fileStorageProvider: FileStorageFileSystemProvider;

  beforeAll(async () => {
    try {
      await Deno.remove('./file/test/file/tmp', { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    await Deno.mkdir('./file/test/file/tmp');
  });

  beforeEach(() => {
    fileStorageProvider = new FileStorageFileSystemProvider('./file/test/file/tmp');
  });

  describe('save', () => {
    it(`shall return an error is file doesn't exist`, async () => {
      const fileMetadata = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-05 08:00:00'))
        .build();

      try {
        await fileStorageProvider.save(fileMetadata.id, './file/test/file/404.txt');
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall save a file', async () => {
      const fileMetadata = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-05 08:00:00'))
        .build();

      await fileStorageProvider.save(fileMetadata.id, './file/test/file/test.txt');

      try {
        const fileStat = await Deno.lstat(`./file/test/file/tmp/${fileMetadata.id}`);
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
      await Deno.copyFile('./file/test/file/test.txt', `./file/test/file/tmp/${id}`);

      const stream = await fileStorageProvider.getStream(id);
      assertInstanceOf(stream, ReadableStream);
      await stream.cancel();
    });
  });

  describe('remove', () => {
    it('shall remove a valid file', async () => {
      const id = crypto.randomUUID();
      await Deno.copyFile('./file/test/file/test.txt', `./file/test/file/tmp/${id}`);

      await fileStorageProvider.remove(id);

      try {
        await Deno.lstat(`./file/test/file/tmp/${id}`);
        unreachable();
      } catch (error) {
        assertInstanceOf(error, Deno.errors.NotFound);
      }
    });

    it('shall get an error when removing a non existing file', async () => {
      const notExistingId = crypto.randomUUID();

      try {
        await fileStorageProvider.remove(notExistingId);
        console.log('1');
        unreachable();
      } catch (error) {
        console.log('2');
        assertInstanceOf(error, NotFoundException);
      }
    });
  });
});
