import { beforeEach, describe, it } from '@std/testing/bdd';
import { assertEquals, assertInstanceOf } from '@std/assert';
import { UserFileSystemRepository } from './user.fs.repository.ts';
import { userBuilder } from '../../test/user.builder.ts';
import { NotFoundException } from '../../../shared/lib/exceptions.ts';

const userPath = './app/user/test/tmp/user.json';

describe('UserFileSystemRepository', () => {
  let userFileSystemRepository: UserFileSystemRepository;

  beforeEach(async () => {
    try {
      await Deno.remove(userPath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      console.info('No tmp directory, skip');
    }

    userFileSystemRepository = new UserFileSystemRepository(userPath);
  });

  describe('getByEmail', () => {
    it('shall get user if email is known', async () => {
      const user = userBuilder().build();
      const content = [user.toObject()];
      await Deno.writeTextFile(userPath, JSON.stringify(content));

      const requestedUser = await userFileSystemRepository.getByEmail(user.email.value);
      assertEquals(requestedUser, user);
    });

    it('shall throw an error if user email is not known', async () => {
      const user = userBuilder().build();
      const content = [user.toObject()];
      await Deno.writeTextFile(userPath, JSON.stringify(content));

      let thrownError: Error | null = null;

      try {
        await userFileSystemRepository.getByEmail('fail@fail.com');
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, NotFoundException);
    });
  });

  describe('getByReferral', () => {
    it('shall get user if referral is known', async () => {
      const user = userBuilder().build();
      const content = [user.toObject()];
      await Deno.writeTextFile(userPath, JSON.stringify(content));

      const requestedUser = await userFileSystemRepository.getByReferral(user.referral.value);
      assertEquals(requestedUser, user);
    });

    it('shall throw an error if user referral is not known', async () => {
      const user = userBuilder().build();
      const content = [user.toObject()];
      await Deno.writeTextFile(userPath, JSON.stringify(content));

      let thrownError: Error | null = null;

      try {
        await userFileSystemRepository.getByReferral('FAKE');
      } catch (error) {
        thrownError = error;
      }

      assertInstanceOf(thrownError, NotFoundException);
    });
  });

  describe('save', () => {
    it('shall save a user if props are valid', async () => {
      const user = userBuilder().build();
      await userFileSystemRepository.save(user);

      const text = await Deno.readTextFile(userPath);
      const expectedContent = [user.toObject()];
      assertEquals(JSON.parse(text), expectedContent);
    });

    it('shall replace an existing user if props are valid', async () => {
      const user = userBuilder().build();
      const user2 = userBuilder().build();
      const content = [user.toObject(), user2.toObject()];
      await Deno.writeTextFile(userPath, JSON.stringify(content));

      user.updateName('YOLO');
      await userFileSystemRepository.save(user);

      const text = await Deno.readTextFile(userPath);
      const expectedContent = [user.toObject(), user2.toObject()];
      assertEquals(JSON.parse(text), expectedContent);
    });
  });
});
