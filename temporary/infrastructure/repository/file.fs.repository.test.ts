import { beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { FileFileSystemRepository } from './file.fs.repository.ts';
import { fileBuilder } from '../../test/file.builder.ts';
import { assertEquals, assertInstanceOf, unreachable } from 'jsr:@std/assert@1';
import { NotFoundException, ParseErrorException } from '../../../shared/lib/exceptions.ts';

describe('FileFileSystemRepository', () => {
  let fileRepository: FileFileSystemRepository;

  beforeEach(async () => {
    try {
      await Deno.remove('./tmp-file.ts');
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    fileRepository = new FileFileSystemRepository('./tmp-file.ts');
  });

  describe('save', () => {
    it('shall save a valid file when there is no file saved', async () => {
      const file = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-05 08:00:00'))
        .build();

      await fileRepository.save(file);

      const text = await Deno.readTextFile('./tmp-file.ts');
      const expectedContent = [file.serialize()];
      assertEquals(JSON.parse(text), expectedContent);
    });

    it('shall save a valid file when there is files already saved', async () => {
      const file1 = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(10)
        .withName('BBBBB.txt')
        .createdAt(new Date('2024-08-07 08:00:00'))
        .build();

      const file2 = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(20)
        .withName('AAAAA.jpg')
        .createdAt(new Date('2024-08-06 08:00:00'))
        .build();

      const content = [file1.serialize(), file2.serialize()];
      await Deno.writeTextFile('./tmp-file.ts', JSON.stringify(content));

      const file = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-08 08:00:00'))
        .build();

      await fileRepository.save(file);

      const text = await Deno.readTextFile('./tmp-file.ts');
      const expectedContent = [file1.serialize(), file2.serialize(), file.serialize()];
      assertEquals(JSON.parse(text), expectedContent);
    });

    it('shall return an error if saved file is not parsable', async () => {
      await Deno.writeTextFile('./tmp-file.ts', 'AAAAAAAAA');

      const file = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-08 08:00:00'))
        .build();

      try {
        await fileRepository.save(file);
        unreachable();
      } catch (error) {
        assertInstanceOf(error, ParseErrorException);
      }
    });
  });

  describe('get', () => {
    it('shall get an error if there is no saved file', async () => {
      try {
        await fileRepository.get(crypto.randomUUID());
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall get no file if requested file is not saved', async () => {
      const file1 = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(10)
        .withName('BBBBB.txt')
        .createdAt(new Date('2024-08-07 08:00:00'))
        .build();

      const file2 = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(20)
        .withName('AAAAA.jpg')
        .createdAt(new Date('2024-08-06 08:00:00'))
        .build();

      const content = [file1.serialize(), file2.serialize()];
      await Deno.writeTextFile('./tmp-file.ts', JSON.stringify(content));

      try {
        await fileRepository.get('AAAA');
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall get requested file if saved', async () => {
      const file1 = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(10)
        .withName('BBBBB.txt')
        .createdAt(new Date('2024-08-07 08:00:00'))
        .build();

      const file2 = fileBuilder()
        .withId(crypto.randomUUID())
        .withSize(20)
        .withName('AAAAA.jpg')
        .createdAt(new Date('2024-08-06 08:00:00'))
        .build();

      const content = [file1.serialize(), file2.serialize()];
      await Deno.writeTextFile('./tmp-file.ts', JSON.stringify(content));

      const requestedFile = await fileRepository.get(file2.id);
      assertEquals(requestedFile, file2);
    });
  });
});
