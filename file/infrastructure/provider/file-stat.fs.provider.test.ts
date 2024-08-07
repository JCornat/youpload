import { beforeEach, describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf, unreachable } from '@std/assert';
import { NotFoundException } from 'shared/lib/exceptions.ts';
import { FileStatFileSystemProvider } from 'file/infrastructure/provider/file-stat.fs.provider.ts';

describe('FileStatFileSystemProvider', () => {
  let fileStatProvider: FileStatFileSystemProvider;

  beforeEach(() => {
    fileStatProvider = new FileStatFileSystemProvider();
  });

  describe('getSize', () => {
    it(`shall return an error if file doesn't exist`, async () => {
      try {
        await fileStatProvider.getSize('./file/test/file/404.txt');
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it(`shall return the size of a valid file`, async () => {
      const id = crypto.randomUUID();
      await Deno.copyFile('./file/test/file/test.txt', `./file/test/file/tmp/${id}`);

      const size = await fileStatProvider.getSize(`./file/test/file/tmp/${id}`);
      assertEquals(6, size);
    });
  });
});
