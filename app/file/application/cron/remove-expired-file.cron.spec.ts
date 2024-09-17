import { beforeAll, beforeEach, describe, it } from '@std/testing/bdd';
import { createFileFixture, FileFixture } from '../../test/file.fixture.ts';
import { fileMetadataBuilder } from '../../test/file-metadata.builder.ts';
import * as fs from '@std/fs';

describe('Feature: Remove expired file', () => {
  let fixture: FileFixture;

  beforeAll(async () => {
    await fs.ensureDir('./app/file/test/file/tmp');
  });

  beforeEach(() => {
    fixture = createFileFixture();
  });

  it('shall remove expired file from repository and file system', async () => {
    fixture.givenNowIs(new Date('2024-08-05 08:00:00'));

    const expiredFileMetadata = fileMetadataBuilder().expireAt(new Date('2024-08-05 07:59:58')).build();
    await fixture.givenFile(expiredFileMetadata, './app/file/test/file/reference.txt');

    await fixture.whenExpiredFilesAreRemoved();

    await fixture.thenRemainingFilesShouldBe([]);
    await fixture.thenFollowingStoredFilesShouldBeRemoved([expiredFileMetadata.id]);
  });

  it('shall not remove a valid file', async () => {
    fixture.givenNowIs(new Date('2024-08-05 08:00:00'));

    const validFileMetadata = fileMetadataBuilder().expireAt(new Date('2024-08-05 08:00:01')).build();
    await fixture.givenFile(validFileMetadata, './app/file/test/file/reference.txt');

    await fixture.whenExpiredFilesAreRemoved();

    await fixture.thenRemainingFilesShouldBe([validFileMetadata]);
    await fixture.thenFollowingStoredFilesShouldNotBeRemoved([validFileMetadata.id]);
  });
});
