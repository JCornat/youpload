import { UserRepository } from '@user/domain/repository/user.repository.ts';
import { PasswordHashingProvider } from '@user/domain/provider/password-hashing.provider.ts';
import { ArgumentInvalidException, NotMatchingPasswordException } from '@shared/lib/exceptions.ts';
import { defaultUserRepository } from '@user/infrastructure/repository/user.fs.repository.ts';
import { defaultPasswordHashingProvider } from '@user/infrastructure/provider/password-hashing.bcrypt.repository.ts';

export interface DeleteAccountCommand {
  userId: string;
  currentPassword: string;
}

export class DeleteAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository = defaultUserRepository,
    private readonly passwordHashingProvider: PasswordHashingProvider = defaultPasswordHashingProvider,
  ) {}

  async handle(deleteAccountCommand: DeleteAccountCommand): Promise<void> {
    if (!deleteAccountCommand.userId) {
      throw new ArgumentInvalidException('User id must be provided');
    }

    if (!deleteAccountCommand.currentPassword) {
      throw new ArgumentInvalidException('Current password must be provided');
    }

    const user = await this.userRepository.get(deleteAccountCommand.userId);

    const isPasswordValid = await this.passwordHashingProvider.compare(deleteAccountCommand.currentPassword, user.password.value);
    if (!isPasswordValid) {
      throw new NotMatchingPasswordException('Current password do not match');
    }

    await this.userRepository.remove(deleteAccountCommand.userId);
  }
}

export const deleteAccountUseCase = new DeleteAccountUseCase();
