import { beforeAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { createTemporaryFileFixture, TemporaryFileFixture } from '../../../test/temporary-file.fixture.ts';
import { temporaryFileBuilder } from '../../../test/temporary-file.builder.ts';
import { DownloadTemporaryFileQuery } from './download-temporary-file.use-case.ts';
import { NotFoundException } from '../../../../shared/lib/exceptions.ts';
import { InspectTemporaryFileQuery } from './inspect-temporary-file.use-case.ts';

describe('Feature: Request temporary file', () => {
  let fixture: TemporaryFileFixture;

  beforeEach(() => {
    fixture = createTemporaryFileFixture();
  });

  it('shall give a link for a valid temporary file', async () => {
    fixture.givenNowIs(new Date('2023-01-19T19:10:00.000Z'));

    const storedFile = temporaryFileBuilder()
      .withId('A.txt')
      .withName('test')
      .withSize(10)
      .createdAt(new Date('2023-01-19T19:10:00.000Z'))
      .build();

    fixture.givenStoredFile(storedFile);

    const command: DownloadTemporaryFileQuery = {
      id: storedFile.id,
    };

    await fixture.whenTemporaryFileIsInspected(command);

    fixture.thenInspectedFileShallBe({ id: 'A.txt', name: 'test', size: 10, createdAt: '2023-01-19T19:10:00.000Z' });
  });

  it('shall return an error for non existing file', async () => {
    const command: InspectTemporaryFileQuery = {
      id: '404.txt',
    };

    await fixture.whenTemporaryFileIsInspected(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });
});
