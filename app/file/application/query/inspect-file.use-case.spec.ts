import { beforeEach, describe, it } from '@std/testing/bdd';
import { createFileFixture, FileFixture } from '@file/test/file.fixture.ts';
import { fileMetadataBuilder } from '@file/test/file-metadata.builder.ts';
import { DownloadFileQuery } from '@file/application/query/download-file.use-case.ts';
import { ExpiredFileException, NotFoundException } from '@shared/lib/exceptions.ts';
import { InspectFileQuery } from '@file/application/query/inspect-file.use-case.ts';

describe('Feature: Inspect file', () => {
  let fixture: FileFixture;

  beforeEach(() => {
    fixture = createFileFixture();
  });

  it('shall give metadata for a stored file', async () => {
    fixture.givenNowIs(new Date('2023-01-19T19:10:00.000Z'));

    const storedFileMetadata = fileMetadataBuilder()
      .expireAt(new Date('2023-01-19T20:10:00.000Z'))
      .build();

    fixture.givenFileMetadata(storedFileMetadata);

    const command = {
      id: storedFileMetadata.id,
    } satisfies DownloadFileQuery;

    await fixture.whenFileMetadataIsInspected(command);

    fixture.thenInspectedFileShallBe(storedFileMetadata);
  });

  it('shall give an error for expired file', async () => {
    fixture.givenNowIs(new Date('2023-01-19T19:11:00.000Z'));

    const storedFileMetadata = fileMetadataBuilder()
      .expireAt(new Date('2023-01-19T19:10:00.000Z'))
      .build();

    fixture.givenFileMetadata(storedFileMetadata);

    const command = {
      id: storedFileMetadata.id,
    } satisfies DownloadFileQuery;

    await fixture.whenFileMetadataIsInspected(command);

    fixture.thenExpectedErrorShallBe(ExpiredFileException);
  });

  it('shall return an error for non existing file', async () => {
    const command = {
      id: crypto.randomUUID(),
    } satisfies InspectFileQuery;

    await fixture.whenFileMetadataIsInspected(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });
});
