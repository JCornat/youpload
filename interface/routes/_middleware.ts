import { FreshContext } from '$fresh/server.ts';
import { getCookies } from '@std/http/cookie';
import { SessionFileSystemRepository } from '../../app/user/infrastructure/repository/session.fs.repository.ts';
import { UserFileSystemRepository } from '../../app/user/infrastructure/repository/user.fs.repository.ts';
import { RemoveExpiredFilesCron } from '../../app/file/application/cron/remove-expired-file.cron.ts';
import { DateStubProvider } from '../../app/shared/infrastructure/provider/date.stub.provider.ts';
import { FileStorageFileSystemProvider } from '../../app/file/infrastructure/provider/file-storage.fs.provider.ts';
import { FileMetadataFileSystemRepository } from '../../app/file/infrastructure/repository/file-metadata.fs.repository.ts';

export interface State {
  isLoggedIn: boolean;
  userName: string;
  userId: string;
}

export class Context {
  private static context: Context;

  public constructor() {
    Deno.cron('Remove expired files cron job', '* * * * *', () => {
      const fileMetadataRepository = new FileMetadataFileSystemRepository();
      const fileStorageProvider = new FileStorageFileSystemProvider();
      const dateProvider = new DateStubProvider();
      const removeExpiredFilesCron = new RemoveExpiredFilesCron(fileMetadataRepository, fileStorageProvider, dateProvider);
      removeExpiredFilesCron.execute();
    });
  }

  public static async init() {
    Context.context = new Context();
  }

  public static instance() {
    if (this.context) {
      return this.context;
    } else {
      throw new Error('Context is not initialized!');
    }
  }
}

export async function handler(req: Request, ctx: FreshContext<State>) {
  try {
    const cookies = getCookies(req.headers);
    const auth = cookies.auth;
    if (auth) {
      const sessionRepository = new SessionFileSystemRepository();
      const session = await sessionRepository.get(auth);
      const userId = session.userId;
      const userRepository = new UserFileSystemRepository();
      const user = await userRepository.get(userId);
      ctx.state.isLoggedIn = true;
      ctx.state.userName = user.name.value;
      ctx.state.userId = user.id;
    }
  } catch {
    //
  }

  return await ctx.next();
}
