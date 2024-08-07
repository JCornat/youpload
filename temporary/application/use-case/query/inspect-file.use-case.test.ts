import { beforeAll, beforeEach, describe, it } from 'jsr:@std/testing/bdd';
import { createFileFixture, FileFixture } from '../../../test/file.fixture.ts';
import { fileBuilder } from '../../../test/file.builder.ts';
import { DownloadFileQuery } from './download-file.use-case.ts';
import { ExpiredFileException, NotFoundException } from '../../../../shared/lib/exceptions.ts';
import { InspectFileQuery } from './inspect-file.use-case.ts';

describe('Feature: Inspect file', () => {
  let fixture: FileFixture;

  beforeEach(() => {
    fixture = createFileFixture();
  });

  it('shall give a link for a valid file', async () => {
    fixture.givenNowIs(new Date('2023-01-19T19:10:00.000Z'));

    const storedFile = fileBuilder()
      .expireAt(new Date('2023-01-19T20:10:00.000Z'))
      .build();

    fixture.givenStoredFile(storedFile);

    const command: DownloadFileQuery = {
      id: storedFile.id,
    };

    await fixture.whenFileIsInspected(command);

    fixture.thenInspectedFileShallBe({ id: storedFile.id, name: storedFile.name, size: storedFile.size, createdAt: storedFile.createdAt.toISOString() });
  });

  it('shall give an error for expired file', async () => {
    fixture.givenNowIs(new Date('2023-01-19T19:11:00.000Z'));

    const storedFile = fileBuilder()
      .expireAt(new Date('2023-01-19T19:10:00.000Z'))
      .build();

    fixture.givenStoredFile(storedFile);

    const command: DownloadFileQuery = {
      id: storedFile.id,
    };

    await fixture.whenFileIsInspected(command);

    fixture.thenExpectedErrorShallBe(ExpiredFileException);
  });

  it('shall return an error for non existing file', async () => {
    const command: InspectFileQuery = {
      id: crypto.randomUUID(),
    };

    await fixture.whenFileIsInspected(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });
});
