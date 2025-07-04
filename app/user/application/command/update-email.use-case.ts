import { UserRepository } from '@user/domain/repository/user.repository.ts';
import { PasswordHashingProvider } from '@user/domain/provider/password-hashing.provider.ts';
import { ArgumentInvalidException, NotMatchingPasswordException } from '@shared/lib/exceptions.ts';
import { defaultUserRepository } from '@user/infrastructure/repository/user.fs.repository.ts';
import { defaultPasswordHashingProvider } from '@user/infrastructure/provider/password-hashing.bcrypt.repository.ts';

export interface UpdateEmailCommand {
  userId: string;
  newEmail: string;
  currentPassword: string;
}

export class UpdateEmailUseCase {
  constructor(
    private readonly userRepository: UserRepository = defaultUserRepository,
    private readonly passwordHashingProvider: PasswordHashingProvider = defaultPasswordHashingProvider,
  ) {}

  async handle(updateEmailCommand: UpdateEmailCommand): Promise<void> {
    if (!updateEmailCommand.userId) {
      throw new ArgumentInvalidException('User id must be provided');
    }

    if (!updateEmailCommand.newEmail) {
      throw new ArgumentInvalidException('New email must be provided');
    }

    if (!updateEmailCommand.currentPassword) {
      throw new ArgumentInvalidException('Current password must be provided');
    }

    const user = await this.userRepository.get(updateEmailCommand.userId);

    const isPasswordValid = await this.passwordHashingProvider.compare(updateEmailCommand.currentPassword, user.password.value);
    if (!isPasswordValid) {
      throw new NotMatchingPasswordException('Passwords do not match');
    }

    user.updateEmail(updateEmailCommand.newEmail);
    await this.userRepository.save(user);
  }
}
