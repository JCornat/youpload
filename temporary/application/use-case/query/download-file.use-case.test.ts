import { beforeAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { createFileFixture, FileFixture } from '../../../test/file.fixture.ts';
import { fileMetadataBuilder } from '../../../test/file-metadata.builder.ts';
import { DownloadFileQuery } from './download-file.use-case.ts';
import { ExpiredFileException, NotFoundException } from '../../../../shared/lib/exceptions.ts';

describe('Feature: Download file', () => {
  let fixture: FileFixture;

  beforeAll(async () => {
    try {
      await Deno.remove('./temporary/test/file/tmp', { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    await Deno.mkdir('./temporary/test/file/tmp');
  });

  beforeEach(() => {
    fixture = createFileFixture();
  });

  it('shall give a link for a valid file', async () => {
    const storedFileMetadata = fileMetadataBuilder().build();
    await fixture.givenStoredBinaryFile(storedFileMetadata, './temporary/test/file/reference.txt');

    const command: DownloadFileQuery = {
      id: storedFileMetadata.id,
    };

    await fixture.whenFileIsDownloaded(command);

    await fixture.thenDownloadedFileShallBeEqualToFile('./temporary/test/file/reference.txt');
  });

  it('shall return an error for expired file', async () => {
    fixture.givenNowIs(new Date('2023-01-19T19:11:00.000Z'));

    const storedFileMetadata = fileMetadataBuilder()
      .expireAt(new Date('2023-01-19T19:10:00.000Z'))
      .build();

    await fixture.givenStoredBinaryFile(storedFileMetadata, './temporary/test/file/reference.txt');

    const command: DownloadFileQuery = {
      id: storedFileMetadata.id,
    };

    await fixture.whenFileIsDownloaded(command);

    fixture.thenExpectedErrorShallBe(ExpiredFileException);
  });

  it('shall return an error for non existing file', async () => {
    const storedFileMetadata = fileMetadataBuilder().build();
    fixture.givenStoredFile(storedFileMetadata);

    const command: DownloadFileQuery = {
      id: 'A.txt',
    };

    await fixture.whenFileIsDownloaded(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });
});
