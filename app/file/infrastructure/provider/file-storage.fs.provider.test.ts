import { beforeAll, beforeEach, describe, it } from '@std/testing/bdd';
import { FileStorageFileSystemProvider } from './file-storage.fs.provider.ts';
import { fileMetadataBuilder } from '../../test/file-metadata.builder.ts';
import { assertExists, assertInstanceOf } from '@std/assert';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';

describe('FileStorageFileSystemProvider', () => {
  let fileStorageProvider: FileStorageFileSystemProvider;

  beforeAll(async () => {
    try {
      await Deno.remove('./app/file/test/file/tmp', { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    await Deno.mkdir('./app/file/test/file/tmp');
  });

  beforeEach(() => {
    fileStorageProvider = new FileStorageFileSystemProvider('./app/file/test/file/tmp');
  });

  describe('save', () => {
    it(`shall return an error is file doesn't exist`, async () => {
      const fileMetadata = fileMetadataBuilder().build();

      let thrownError: Error | null = null;

      try {
        await fileStorageProvider.save(fileMetadata.id, './app/file/test/file/404.txt');
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, NotFoundException);
    });

    it('shall save a file', async () => {
      const fileMetadata = fileMetadataBuilder().build();

      await fileStorageProvider.save(fileMetadata.id, './app/file/test/file/test.txt');

      const fileStat = await Deno.lstat(`./app/file/test/file/tmp/${fileMetadata.id}`);
      assertExists(fileStat);
    });
  });

  describe('getStream', () => {
    it(`shall not stream and return an error is file doesn't exist`, async () => {
      const id = crypto.randomUUID();

      let thrownError: Error | null = null;

      try {
        await fileStorageProvider.getStream(id);
      } catch (error) {
        thrownError = error;
      }
      assertInstanceOf(thrownError, NotFoundException);
    });

    it('shall get a stream for valid file', async () => {
      const id = crypto.randomUUID();
      await Deno.copyFile('./app/file/test/file/test.txt', `./app/file/test/file/tmp/${id}`);

      const stream = await fileStorageProvider.getStream(id);
      assertInstanceOf(stream, ReadableStream);
      await stream.cancel();
    });
  });

  describe('remove', () => {
    it('shall remove a valid file', async () => {
      const id = crypto.randomUUID();
      await Deno.copyFile('./app/file/test/file/test.txt', `./app/file/test/file/tmp/${id}`);

      await fileStorageProvider.remove(id);

      let thrownError: Error | null = null;

      try {
        await Deno.lstat(`./app/file/test/file/tmp/${id}`);
      } catch (error) {
        thrownError = error;
      }
      assertInstanceOf(thrownError, Deno.errors.NotFound);
    });

    it('shall get an error when removing a non existing file', async () => {
      const notExistingId = crypto.randomUUID();

      let thrownError: Error | null = null;

      try {
        await fileStorageProvider.remove(notExistingId);
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, NotFoundException);
    });
  });
});
