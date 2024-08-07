import { beforeEach, describe, it } from 'jsr:@std/testing@0.224.0/bdd';
import { UploadFileCommand } from './upload-file.use-case.ts';
import { fileBuilder } from '../../../test/file.builder.ts';
import { createFileFixture, FileFixture } from '../../../test/file.fixture.ts';
import { NotFoundException } from '../../../../shared/lib/exceptions.ts';

describe('Feature: Send file', () => {
  let fixture: FileFixture;

  beforeEach(() => {
    fixture = createFileFixture();
  });

  it('shall save a valid file', async () => {
    fixture.givenNowIs(new Date('2024-08-05 08:00:00'));
    fixture.givenFileHasSize('./temporary/test/file/test.txt', 6);

    const command: UploadFileCommand = {
      name: 'test-file.txt',
      filePath: './temporary/test/file/test.txt',
      expireAt: new Date('2024-08-05 08:00:00'),
    };

    const fileId = await fixture.whenFileIsSent(command);

    const expectedFile = fileBuilder()
      .withId(fileId)
      .withName('test-file.txt')
      .withSize(6)
      .createdAt(new Date('2024-08-05 08:00:00'))
      .expireAt(new Date('2024-08-05 08:00:00'))
      .build();

    fixture.thenFileStoredShallBe(expectedFile);
  });

  it('shall not save a non existing file', async () => {
    const command: UploadFileCommand = {
      name: '404.txt',
      filePath: './temporary/test/file/404.txt',
      expireAt: new Date('2024-08-05 08:00:00'),
    };

    await fixture.whenFileIsSent(command);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });
});
