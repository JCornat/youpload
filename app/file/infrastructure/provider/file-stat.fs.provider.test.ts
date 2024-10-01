import { beforeEach, describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';
import { FileStatFileSystemProvider } from './file-stat.fs.provider.ts';

describe('FileStatFileSystemProvider', () => {
  let fileStatProvider: FileStatFileSystemProvider;

  beforeEach(() => {
    fileStatProvider = new FileStatFileSystemProvider();
  });

  describe('getSize', () => {
    it(`shall return an error if file doesn't exist`, async () => {
      let thrownError: Error | null = null;

      try {
        await fileStatProvider.getSize('./app/file/test/file/404.txt');
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, NotFoundException);
    });

    it(`shall return the size of a valid file`, async () => {
      const id = crypto.randomUUID();
      await Deno.copyFile('./app/file/test/file/test.txt', `./app/file/test/file/tmp/${id}`);

      const size = await fileStatProvider.getSize(`./app/file/test/file/tmp/${id}`);
      assertEquals(6, size);
    });
  });
});
