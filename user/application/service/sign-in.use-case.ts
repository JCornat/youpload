import { SessionRepository } from '../../domain/repository/session.repository.ts';
import { UserRepository } from '../../domain/repository/user.repository.ts';
import { PasswordHashingProvider } from '../../domain/provider/password-hashing.provider.ts';
import { DateProvider } from '../../../shared/domain/provider/date.provider.ts';
import { Session } from '../../domain/model/session.ts';
import { AuthenticationFailedException, NotFoundException } from '../../../shared/lib/exceptions.ts';
import { User } from '../../domain/model/user.ts';

export interface SignInCommand {
  email: string;
  password: string;
  ip: string;
  agent: string;
}

export class SignInUseCase {
  constructor(
    private readonly dateProvider: DateProvider,
    private readonly passwordHashingProvider: PasswordHashingProvider,
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
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
