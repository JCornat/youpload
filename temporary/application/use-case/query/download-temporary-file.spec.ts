import { beforeAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { createTemporaryFileFixture, TemporaryFileFixture } from '../../../test/temporary-file.fixture.ts';
import { temporaryFileBuilder } from '../../../test/temporary-file.builder.ts';
import { DownloadTemporaryFileQuery } from './download-temporary-file.use-case.ts';
import { NotFoundException } from '../../../../shared/lib/exceptions.ts';

describe('Feature: Request temporary file', () => {
  let fixture: TemporaryFileFixture;

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
    fixture = createTemporaryFileFixture();
  });

  it('shall give a link for a valid temporary file', async () => {
    const storedFile = temporaryFileBuilder()
      .withId('A.txt')
      .withName('test')
      .withSize(10)
      .build();

    fixture.givenStoredFile(storedFile);
    await fixture.givenBinaryFile(storedFile, './temporary/test/file/reference.txt');

    const command: DownloadTemporaryFileQuery = {
      id: storedFile.id,
    };

    await fixture.whenTemporaryFileIsDownloaded(command);

    await fixture.thenDownloadedFileShallBeEqualToFile('./temporary/test/file/reference.txt');
  });

  it('shall return an error for non existing file', async () => {
    const storedFile = temporaryFileBuilder()
      .withId('404.txt')
      .withName('test')
      .withSize(10)
      .build();

    fixture.givenStoredFile(storedFile);

    const command: DownloadTemporaryFileQuery = {
      id: 'A.txt',
    };

    await fixture.whenTemporaryFileIsDownloaded(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });
});
