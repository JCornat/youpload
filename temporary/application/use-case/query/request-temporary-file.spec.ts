import { beforeEach, describe, it } from 'jsr:@std/testing@0.224.0/bdd';
import { createTemporaryFileFixture, TemporaryFileFixture } from '../../../test/temporary-file.fixture.ts';
import { temporaryFileBuilder } from '../../../test/temporary-file.builder.ts';

describe('Feature: Request temporary file', () => {
  let fixture: TemporaryFileFixture;

  beforeEach(() => {
    fixture = createTemporaryFileFixture();
  });

  it('shall give a link for a valid temporary file', async () => {
    const storedFile = temporaryFileBuilder().withId('A').withName('test').withSize(10).build();
    fixture.givenStoredFile(storedFile);

    const command = {
      id: 'A',
    };

    const stream = await fixture.whenTemporaryFileIsRequested(command);

    fixture.thenStreamReceivedShallBe({ id: 'A', filePath: './temporary/test/file/404.txt' });
  });
});
