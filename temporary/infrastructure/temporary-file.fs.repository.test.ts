import { beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { TemporaryFileFileSystemRepository } from './temporary-file.fs.repository.ts';
import { temporaryFileBuilder } from '../test/temporary-file.builder.ts';
import { assertEquals, assertInstanceOf, unreachable } from 'jsr:@std/assert@1';
import { NotFoundException, ParseErrorException } from '../../shared/lib/exceptions.ts';

describe('TemporaryFileFileSystemRepository', () => {
  let temporaryFileRepository: TemporaryFileFileSystemRepository;

  beforeEach(async () => {
    try {
      await Deno.remove('./tmp-temporary-file.ts');
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    temporaryFileRepository = new TemporaryFileFileSystemRepository('./tmp-temporary-file.ts');
  });

  describe('save', () => {
    it('shall save a valid file when there is no file saved', async () => {
      const temporaryFile = temporaryFileBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-05 08:00:00'))
        .build();

      await temporaryFileRepository.save(temporaryFile);

      const text = await Deno.readTextFile('./tmp-temporary-file.ts');
      const expectedContent = [temporaryFile.serialize()];
      assertEquals(JSON.parse(text), expectedContent);
    });

    it('shall save a valid file when there is files already saved', async () => {
      const temporaryFile1 = temporaryFileBuilder()
        .withId(crypto.randomUUID())
        .withSize(10)
        .withName('BBBBB.txt')
        .createdAt(new Date('2024-08-07 08:00:00'))
        .build();

      const temporaryFile2 = temporaryFileBuilder()
        .withId(crypto.randomUUID())
        .withSize(20)
        .withName('AAAAA.jpg')
        .createdAt(new Date('2024-08-06 08:00:00'))
        .build();

      const content = [temporaryFile1.serialize(), temporaryFile2.serialize()];
      await Deno.writeTextFile('./tmp-temporary-file.ts', JSON.stringify(content));

      const temporaryFile = temporaryFileBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-08 08:00:00'))
        .build();

      await temporaryFileRepository.save(temporaryFile);

      const text = await Deno.readTextFile('./tmp-temporary-file.ts');
      const expectedContent = [temporaryFile1.serialize(), temporaryFile2.serialize(), temporaryFile.serialize()];
      assertEquals(JSON.parse(text), expectedContent);
    });

    it('shall return an error if saved file is not parsable', async () => {
      await Deno.writeTextFile('./tmp-temporary-file.ts', 'AAAAAAAAA');

      const temporaryFile = temporaryFileBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-08 08:00:00'))
        .build();

      try {
        await temporaryFileRepository.save(temporaryFile);
        unreachable();
      } catch (error) {
        assertInstanceOf(error, ParseErrorException);
      }
    });
  });

  describe('get', () => {
    it('shall get an error if there is no saved file', async () => {
      try {
        await temporaryFileRepository.get(crypto.randomUUID());
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall get no file if requested file is not saved', async () => {
      const temporaryFile1 = temporaryFileBuilder()
        .withId(crypto.randomUUID())
        .withSize(10)
        .withName('BBBBB.txt')
        .createdAt(new Date('2024-08-07 08:00:00'))
        .build();

      const temporaryFile2 = temporaryFileBuilder()
        .withId(crypto.randomUUID())
        .withSize(20)
        .withName('AAAAA.jpg')
        .createdAt(new Date('2024-08-06 08:00:00'))
        .build();

      const content = [temporaryFile1.serialize(), temporaryFile2.serialize()];
      await Deno.writeTextFile('./tmp-temporary-file.ts', JSON.stringify(content));

      try {
        await temporaryFileRepository.get('AAAA');
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall get requested file if saved', async () => {
      const temporaryFile1 = temporaryFileBuilder()
        .withId(crypto.randomUUID())
        .withSize(10)
        .withName('BBBBB.txt')
        .createdAt(new Date('2024-08-07 08:00:00'))
        .build();

      const temporaryFile2 = temporaryFileBuilder()
        .withId(crypto.randomUUID())
        .withSize(20)
        .withName('AAAAA.jpg')
        .createdAt(new Date('2024-08-06 08:00:00'))
        .build();

      const content = [temporaryFile1.serialize(), temporaryFile2.serialize()];
      await Deno.writeTextFile('./tmp-temporary-file.ts', JSON.stringify(content));

      const requestedFile = await temporaryFileRepository.get(temporaryFile2.id);
      assertEquals(requestedFile, temporaryFile2);
    });
  });
});
