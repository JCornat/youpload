import { beforeEach, describe, it } from '@std/testing/bdd';
import { createFileFixture, FileFixture } from 'file/test/file.fixture.ts';

describe('Feature: Remove expired file', () => {
  let fixture: FileFixture;

  beforeEach(() => {
    fixture = createFileFixture();
  });

  it('shall remove an expired file from repository and file system', () => {
    fixture.givenNowIs(new Date('2024-08-05 08:00:00'));
  });

  it('shall remove a non existing expired file from repository', async () => {
  });

  it('shall not remove a valid file', async () => {
  });
});
