import { beforeEach, describe, it } from 'jsr:@std/testing@0.224.0/bdd';
import { SendTemporaryFileCommand } from './send-temporary-file.use-case.ts';
import { temporaryFileBuilder } from '../../../test/temporary-file.builder.ts';
import { createTemporaryFileFixture, TemporaryFileFixture } from '../../../test/temporary-file.fixture.ts';
import { NotFoundException } from '../../../../shared/lib/exceptions.ts';

describe('Feature: Send temporary file', () => {
  let fixture: TemporaryFileFixture;

  beforeEach(() => {
    fixture = createTemporaryFileFixture();
  });

  it('shall save a valid temporary file', async () => {
    fixture.givenNowIs(new Date('2024-08-05 08:00:00'));
    fixture.givenFileHasSize('./temporary/test/file/test.txt', 6);

    const command: SendTemporaryFileCommand = {
      name: 'test-file.txt',
      filePath: './temporary/test/file/test.txt',
      expireAt: new Date('2024-08-05 08:00:00'),
    };

    const fileId = await fixture.whenTemporaryFileIsSent(command);

    const expectedFile = temporaryFileBuilder()
      .withId(fileId)
      .withName('test-file.txt')
      .withSize(6)
      .createdAt(new Date('2024-08-05 08:00:00'))
      .expireAt(new Date('2024-08-05 08:00:00'))
      .build();

    fixture.thenFileStoredShallBe(expectedFile);
  });

  it('shall not save a non existing file', async () => {
    const sendTemporaryFileCommand: SendTemporaryFileCommand = {
      name: '404.txt',
      filePath: './temporary/test/file/404.txt',
      expireAt: new Date('2024-08-05 08:00:00'),
    };

    await fixture.whenTemporaryFileIsSent(sendTemporaryFileCommand);

    fixture.thenExpectedErrorShallBe(NotFoundException);
  });
});
