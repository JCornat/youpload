import { beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { assertEquals, assertInstanceOf, unreachable } from 'jsr:@std/assert@1';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';
import { FileStatFileSystemProvider } from './file-stat.fs.provider.ts';

describe('FileStatFileSystemProvider', () => {
  let fileStatProvider: FileStatFileSystemProvider;

  beforeEach(() => {
    fileStatProvider = new FileStatFileSystemProvider();
  });

  describe('getSize', () => {
    it(`shall return an error if file doesn't exist`, async () => {
      try {
        await fileStatProvider.getSize('./temporary/test/file/404.txt');
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it(`shall return the size of a valid file`, async () => {
      const id = crypto.randomUUID();
      await Deno.copyFile('./temporary/test/file/test.txt', `./temporary/test/file/tmp/${id}`);

      const size = await fileStatProvider.getSize(`./temporary/test/file/tmp/${id}`);
      assertEquals(6, size);
    });
  });
});
