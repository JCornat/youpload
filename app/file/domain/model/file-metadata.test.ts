import { describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { FileMetadata } from '@file/domain/model/file-metadata.ts';
import { fileMetadataBuilder } from '@file/test/file-metadata.builder.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';

describe('FileMetadata', () => {
  describe('create', () => {
    it('shall create a FileMetadata with valid inputs', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const expireAt = new Date('2024-01-01 01:00:00');
      const payload = {
        name: 'test-file.txt',
        size: 1024,
        createdAt: createdAt.toISOString(),
        expireAt: expireAt.toISOString(), // 1 hour later
      };

      const fileMetadata = FileMetadata.create(payload);

      const expectedFileMetadata = fileMetadataBuilder()
        .withId(fileMetadata.id)
        .withName(payload.name)
        .withSize(payload.size)
        .createdAt(createdAt)
        .expireAt(expireAt)
        .build();

      assertEquals(expectedFileMetadata, fileMetadata);
    });

    it('shall create a FileMetadata with a name starting with a dot', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const expireAt = new Date('2024-01-01 01:00:00');
      const payload = {
        name: '.env',
        size: 1024,
        createdAt: createdAt.toISOString(),
        expireAt: expireAt.toISOString(), // 1 hour later
      };

      const fileMetadata = FileMetadata.create(payload);

      const expectedFileMetadata = fileMetadataBuilder()
        .withId(fileMetadata.id)
        .withName(payload.name)
        .withSize(payload.size)
        .createdAt(createdAt)
        .expireAt(expireAt)
        .build();

      assertEquals(expectedFileMetadata, fileMetadata);
    });

    it('shall throw an error if the name is too short', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const expireAt = new Date('2024-01-01 01:00:00');
      const payload = {
        name: '',
        size: 1024,
        createdAt: createdAt.toISOString(),
        expireAt: expireAt.toISOString(), // 1 hour later
      };

      let thrownError: Error | null = null;

      try {
        FileMetadata.create(payload);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the name is only a dot', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const expireAt = new Date('2024-01-01 01:00:00');
      const payload = {
        name: '.',
        size: 1024,
        createdAt: createdAt.toISOString(),
        expireAt: expireAt.toISOString(), // 1 hour later
      };

      let thrownError: Error | null = null;

      try {
        FileMetadata.create(payload);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the name is invalid', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const expireAt = new Date('2024-01-01 01:00:00');
      const payload = {
        name: 'invalid:file.txt',
        size: 1024,
        createdAt: createdAt.toISOString(),
        expireAt: expireAt.toISOString(), // 1 hour later
      };

      let thrownError: Error | null = null;

      try {
        FileMetadata.create(payload);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the name without extension', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const expireAt = new Date('2024-01-01 01:00:00');
      const payload = {
        name: 'invalid.',
        size: 1024,
        createdAt: createdAt.toISOString(),
        expireAt: expireAt.toISOString(), // 1 hour later
      };

      let thrownError: Error | null = null;

      try {
        FileMetadata.create(payload);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the name is too long', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const expireAt = new Date('2024-01-01 01:00:00');
      const payload = {
        name: `${'a'.repeat(252)}.txt`,
        size: 1024,
        createdAt: createdAt.toISOString(),
        expireAt: expireAt.toISOString(), // 1 hour later
      };

      let thrownError: Error | null = null;

      try {
        FileMetadata.create(payload);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the size is zero', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const expireAt = new Date('2024-01-01 01:00:00');
      const payload = {
        name: `test-file.txt`,
        size: 0,
        createdAt: createdAt.toISOString(),
        expireAt: expireAt.toISOString(), // 1 hour later
      };

      let thrownError: Error | null = null;

      try {
        FileMetadata.create(payload);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });

    it('shall throw an error if the size is negative', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const expireAt = new Date('2024-01-01 01:00:00');
      const payload = {
        name: `test-file.txt`,
        size: -1,
        createdAt: createdAt.toISOString(),
        expireAt: expireAt.toISOString(), // 1 hour later
      };

      let thrownError: Error | null = null;

      try {
        FileMetadata.create(payload);
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, ArgumentInvalidException);
    });
  });
});
