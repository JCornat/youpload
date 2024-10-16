import { beforeEach, describe, it } from '@std/testing/bdd';
import { FileMetadataFileSystemRepository } from '@file/infrastructure/repository/file-metadata.fs.repository.ts';
import { fileMetadataBuilder } from '@file/test/file-metadata.builder.ts';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { NotFoundException, ParseErrorException } from '@shared/lib/exceptions.ts';

const fileMetadataPath = './app/file/test/tmp/file-metadata.json';

describe('FileFileSystemRepository', () => {
  let fileMetadataRepository: FileMetadataFileSystemRepository;

  beforeEach(async () => {
    try {
      await Deno.remove(fileMetadataPath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    fileMetadataRepository = new FileMetadataFileSystemRepository(fileMetadataPath);
  });

  describe('save', () => {
    it('shall save a valid file when there is no file saved', async () => {
      const fileMetadata = fileMetadataBuilder().build();
      await fileMetadataRepository.save(fileMetadata);

      const text = await Deno.readTextFile(fileMetadataPath);
      const expectedContent = [fileMetadata.toObject()];
      assertEquals(JSON.parse(text), expectedContent);
    });

    it('shall save a valid file when there is files already saved', async () => {
      const fileMetadata1 = fileMetadataBuilder().build();
      const fileMetadata2 = fileMetadataBuilder().build();
      const content = [fileMetadata1.toObject(), fileMetadata2.toObject()];
      await Deno.writeTextFile(fileMetadataPath, JSON.stringify(content));

      const fileMetadata = fileMetadataBuilder().build();
      await fileMetadataRepository.save(fileMetadata);

      const text = await Deno.readTextFile(fileMetadataPath);
      const expectedContent = [fileMetadata1.toObject(), fileMetadata2.toObject(), fileMetadata.toObject()];
      assertEquals(JSON.parse(text), expectedContent);
    });

    it('shall return an error if saved file is not parsable', async () => {
      await Deno.writeTextFile(fileMetadataPath, 'AAAAAAAAA');
      const fileMetadata = fileMetadataBuilder().build();

      let thrownError: Error | null = null;

      try {
        await fileMetadataRepository.save(fileMetadata);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ParseErrorException);
    });
  });

  describe('get', () => {
    it('shall get an error if there is no saved file', async () => {
      let thrownError: Error | null = null;

      try {
        await fileMetadataRepository.get(crypto.randomUUID());
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

    it('shall get no file if requested file is not saved', async () => {
      const fileMetadata1 = fileMetadataBuilder().build();
      const fileMetadata2 = fileMetadataBuilder().build();
      const content = [fileMetadata1.toObject(), fileMetadata2.toObject()];
      await Deno.writeTextFile(fileMetadataPath, JSON.stringify(content));

      let thrownError: Error | null = null;

      try {
        await fileMetadataRepository.get('AAAA');
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

    it('shall get requested file if saved', async () => {
      const fileMetadata1 = fileMetadataBuilder().build();
      const fileMetadata2 = fileMetadataBuilder().build();
      const content = [fileMetadata1.toObject(), fileMetadata2.toObject()];
      await Deno.writeTextFile(fileMetadataPath, JSON.stringify(content));

      const requestedFileMetadata = await fileMetadataRepository.get(fileMetadata2.id);
      assertEquals(requestedFileMetadata, fileMetadata2);
    });
  });

  describe('getAllExpired', () => {
    it('shall return files expired', async () => {
      const fileMetadata1 = fileMetadataBuilder()
        .expireAt(new Date('2024-08-07 08:00:01'))
        .build();

      const fileMetadata2 = fileMetadataBuilder()
        .expireAt(new Date('2024-08-07 07:59:59'))
        .build();

      const content = [fileMetadata1.toObject(), fileMetadata2.toObject()];
      await Deno.writeTextFile(fileMetadataPath, JSON.stringify(content));

      const now = new Date('2024-08-07 08:00:00');
      const requestedFileMetadata = await fileMetadataRepository.getAllExpired(now);
      assertEquals(requestedFileMetadata, [fileMetadata2]);
    });

    it('shall return no files if non are expired', async () => {
      const fileMetadata1 = fileMetadataBuilder()
        .expireAt(new Date('2024-08-07 08:00:01'))
        .build();

      const fileMetadata2 = fileMetadataBuilder()
        .expireAt(new Date('2024-08-07 08:00:02'))
        .build();

      const content = [fileMetadata1.toObject(), fileMetadata2.toObject()];
      await Deno.writeTextFile(fileMetadataPath, JSON.stringify(content));

      const now = new Date('2024-08-07 08:00:00');
      const requestedFileMetadata = await fileMetadataRepository.getAllExpired(now);
      assertEquals(requestedFileMetadata, []);
    });
  });

  describe('remove', () => {
    it('shall remove file expired', async () => {
      const fileMetadata1 = fileMetadataBuilder()
        .build();

      const fileMetadata2 = fileMetadataBuilder()
        .build();

      const content = [fileMetadata1.toObject(), fileMetadata2.toObject()];
      await Deno.writeTextFile(fileMetadataPath, JSON.stringify(content));

      await fileMetadataRepository.remove(fileMetadata1.id);
      const fileContent = await Deno.readTextFile(fileMetadataPath);
      assertEquals(JSON.parse(fileContent), [fileMetadata2.toObject()]);
    });
  });
});
