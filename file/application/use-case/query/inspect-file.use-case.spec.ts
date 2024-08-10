import { beforeEach, describe, it } from '@std/testing/bdd';
import { createFileFixture, FileFixture } from '../../../test/file.fixture.ts';
import { fileMetadataBuilder } from '../../../test/file-metadata.builder.ts';
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

    const storedFileMetadata = fileMetadataBuilder()
      .expireAt(new Date('2023-01-19T20:10:00.000Z'))
      .build();

    fixture.givenFileMetadata(storedFileMetadata);

    const command: DownloadFileQuery = {
      id: storedFileMetadata.id,
    };

    await fixture.whenFileMetadataIsInspected(command);

    fixture.thenInspectedFileShallBe({ id: storedFileMetadata.id, name: storedFileMetadata.name.value, size: storedFileMetadata.size.value, createdAt: storedFileMetadata.createdAt.toISOString() });
  });

  it('shall give an error for expired file', async () => {
    fixture.givenNowIs(new Date('2023-01-19T19:11:00.000Z'));

    const storedFileMetadata = fileMetadataBuilder()
      .expireAt(new Date('2023-01-19T19:10:00.000Z'))
      .build();

    fixture.givenFileMetadata(storedFileMetadata);

    const command: DownloadFileQuery = {
      id: storedFileMetadata.id,
    };

    await fixture.whenFileMetadataIsInspected(command);

    fixture.thenExpectedErrorShallBe(ExpiredFileException);
  });

  it('shall return an error for non existing file', async () => {
    const command: InspectFileQuery = {
      id: crypto.randomUUID(),
    };

    await fixture.whenFileMetadataIsInspected(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });
});
