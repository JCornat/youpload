import { beforeEach, describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { SessionFileSystemRepository } from '@user/infrastructure/repository/session.fs.repository.ts';
import { sessionBuilder } from '@user/test/session.builder.ts';
import { NotFoundException } from '@shared/lib/exceptions.ts';

const sessionPath = './app/user/test/tmp/session.json';

describe('SessionFileSystemRepository', () => {
  let sessionFileSystemRepository: SessionFileSystemRepository;

  beforeEach(async () => {
    try {
      await Deno.remove(sessionPath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    sessionFileSystemRepository = new SessionFileSystemRepository(sessionPath);
  });

  describe('get', () => {
    it('shall get session if id is known', async () => {
      const session = sessionBuilder().build();
      const content = [session.toObject()];
      await Deno.writeTextFile(sessionPath, JSON.stringify(content));

      const requestedSession = await sessionFileSystemRepository.get(session.id);
      assertEquals(requestedSession, session);
    });

    it('shall throw an error if session is not known', async () => {
      const session = sessionBuilder().build();
      const content = [session.toObject()];
      await Deno.writeTextFile(sessionPath, JSON.stringify(content));

      let thrownError: Error | null = null;

      try {
        await sessionFileSystemRepository.get('AAAA');
      } catch (error) {
        if (error instanceof Error) {
          thrownError = error;
        } else {
          console.error('Unexpected error: ', error);
          throw error;
        }
      }

      assertInstanceOf(thrownError, NotFoundException);
    });
  });

  describe('save', () => {
    it('shall save a session if props are valid', async () => {
      const session = sessionBuilder().build();
      await sessionFileSystemRepository.create(session);

      const text = await Deno.readTextFile(sessionPath);
      const expectedContent = [session.toObject()];
      assertEquals(JSON.parse(text), expectedContent);
    });
  });
});
