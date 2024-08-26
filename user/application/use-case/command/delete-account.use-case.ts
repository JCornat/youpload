import { UserRepository } from '../../../domain/repository/user.repository.ts';
import { PasswordHashingProvider } from '../../../domain/provider/password-hashing.provider.ts';
import { ArgumentInvalidException, NotMatchingPasswordException } from '../../../../shared/lib/exceptions.ts';

export interface DeleteAccountCommand {
  userId: string;
  currentPassword: string;
}

export class DeleteAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashingProvider: PasswordHashingProvider,
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
