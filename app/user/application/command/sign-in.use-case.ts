import { SessionRepository } from '@user/domain/repository/session.repository.ts';
import { UserRepository } from '@user/domain/repository/user.repository.ts';
import { PasswordHashingProvider } from '@user/domain/provider/password-hashing.provider.ts';
import { DateProvider } from '@shared/domain/provider/date.provider.ts';
import { Session } from '@user/domain/model/session.ts';
import { AuthenticationFailedException, NotFoundException } from '@shared/lib/exceptions.ts';
import { User } from '@user/domain/model/user.ts';
import { defaultDateProvider } from '@shared/infrastructure/provider/date.stub.provider.ts';
import { defaultPasswordHashingProvider } from '@user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { defaultSessionRepository } from '@user/infrastructure/repository/session.fs.repository.ts';
import { defaultUserRepository } from '@user/infrastructure/repository/user.fs.repository.ts';

export interface SignInCommand {
  email: string;
  password: string;
  ip: string;
  agent: string;
}

export class SignInUseCase {
  constructor(
    private readonly dateProvider: DateProvider = defaultDateProvider,
    private readonly passwordHashingProvider: PasswordHashingProvider = defaultPasswordHashingProvider,
    private readonly sessionRepository: SessionRepository = defaultSessionRepository,
    private readonly userRepository: UserRepository = defaultUserRepository,
  ) {}

  async handle(signInCommand: SignInCommand): Promise<string> {
    const createdAt = this.dateProvider.getNow();

    let user: User;

    try {
      user = await this.userRepository.getByEmail(signInCommand.email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new AuthenticationFailedException('No user found with matching email');
      }

      throw error;
    }

    const isPasswordValid = await this.passwordHashingProvider.compare(signInCommand.password, user.password.value);
    if (!isPasswordValid) {
      throw new AuthenticationFailedException('Password invalid');
    }

    const props = {
      userId: user.id,
      ip: signInCommand.ip,
      agent: signInCommand.agent,
      createdAt,
      lastUsedAt: createdAt,
    };

    const session = Session.create(props);
    await this.sessionRepository.create(session);
    return session.id;
  }
}

export const signInUseCase = new SignInUseCase();
