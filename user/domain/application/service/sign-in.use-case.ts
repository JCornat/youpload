import {SessionRepository} from "../../repository/session.repository.ts";
import {UserRepository} from "../../repository/user.repository.ts";
import {PasswordHashingProvider} from "../../provider/password-hashing.provider.ts";
import {DateProvider} from "../../../../shared/domain/provider/date.provider.ts";
import { Session } from '../../model/session.ts';

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
  ) {
  }

  async handle(signInCommand: SignInCommand): Promise<any> {
    const createdAt = this.dateProvider.getNow();
    const user = await this.userRepository.getByEmail(signInCommand.email);
    const id = crypto.randomUUID();
    const session = Session.create({id, userId: user.id, ip: signInCommand.ip, agent: signInCommand.agent, createdAt, lastUsedAt: createdAt});
    await this.sessionRepository.create(session);
    return id;
  }
}