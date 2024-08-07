import { beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { FileMetadataFileSystemRepository } from './file-metadata.fs.repository.ts';
import { fileMetadataBuilder } from '../../test/file-metadata.builder.ts';
import { assertEquals, assertInstanceOf, unreachable } from 'jsr:@std/assert@1';
import { NotFoundException, ParseErrorException } from '../../../shared/lib/exceptions.ts';

describe('FileFileSystemRepository', () => {
  let fileMetadataRepository: FileMetadataFileSystemRepository;

  beforeEach(async () => {
    try {
      await Deno.remove('./tmp-file-metadata.ts');
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    fileMetadataRepository = new FileMetadataFileSystemRepository('./tmp-file-metadata.ts');
  });

  describe('save', () => {
    it('shall save a valid file when there is no file saved', async () => {
      const fileMetadata = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-05 08:00:00'))
        .build();

      await fileMetadataRepository.save(fileMetadata);

      const text = await Deno.readTextFile('./tmp-file-metadata.ts');
      const expectedContent = [fileMetadata.serialize()];
      assertEquals(JSON.parse(text), expectedContent);
    });

    it('shall save a valid file when there is files already saved', async () => {
      const fileMetadata1 = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(10)
        .withName('BBBBB.txt')
        .createdAt(new Date('2024-08-07 08:00:00'))
        .build();

      const fileMetadata2 = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(20)
        .withName('AAAAA.jpg')
        .createdAt(new Date('2024-08-06 08:00:00'))
        .build();

      const content = [fileMetadata1.serialize(), fileMetadata2.serialize()];
      await Deno.writeTextFile('./tmp-file-metadata.ts', JSON.stringify(content));

      const fileMetadata = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-08 08:00:00'))
        .build();

      await fileMetadataRepository.save(fileMetadata);

      const text = await Deno.readTextFile('./tmp-file-metadata.ts');
      const expectedContent = [fileMetadata1.serialize(), fileMetadata2.serialize(), fileMetadata.serialize()];
      assertEquals(JSON.parse(text), expectedContent);
    });

    it('shall return an error if saved file is not parsable', async () => {
      await Deno.writeTextFile('./tmp-file-metadata.ts', 'AAAAAAAAA');

      const fileMetadata = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(1)
        .withName('test.txt')
        .createdAt(new Date('2024-08-08 08:00:00'))
        .build();

      try {
        await fileMetadataRepository.save(fileMetadata);
        unreachable();
      } catch (error) {
        assertInstanceOf(error, ParseErrorException);
      }
    });
  });

  describe('get', () => {
    it('shall get an error if there is no saved file', async () => {
      try {
        await fileMetadataRepository.get(crypto.randomUUID());
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall get no file if requested file is not saved', async () => {
      const fileMetadata1 = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(10)
        .withName('BBBBB.txt')
        .createdAt(new Date('2024-08-07 08:00:00'))
        .build();

      const fileMetadata2 = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(20)
        .withName('AAAAA.jpg')
        .createdAt(new Date('2024-08-06 08:00:00'))
        .build();

      const content = [fileMetadata1.serialize(), fileMetadata2.serialize()];
      await Deno.writeTextFile('./tmp-file-metadata.ts', JSON.stringify(content));

      try {
        await fileMetadataRepository.get('AAAA');
        unreachable();
      } catch (error) {
        assertInstanceOf(error, NotFoundException);
      }
    });

    it('shall get requested file if saved', async () => {
      const fileMetadata1 = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(10)
        .withName('BBBBB.txt')
        .createdAt(new Date('2024-08-07 08:00:00'))
        .build();

      const fileMetadata2 = fileMetadataBuilder()
        .withId(crypto.randomUUID())
        .withSize(20)
        .withName('AAAAA.jpg')
        .createdAt(new Date('2024-08-06 08:00:00'))
        .build();

      const content = [fileMetadata1.serialize(), fileMetadata2.serialize()];
      await Deno.writeTextFile('./tmp-file-metadata.ts', JSON.stringify(content));

      const requestedFileMetadata = await fileMetadataRepository.get(fileMetadata2.id);
      assertEquals(requestedFileMetadata, fileMetadata2);
    });
  });
});
