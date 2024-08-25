import { UserRepository } from '../../../domain/repository/user.repository.ts';
import { PasswordHashingProvider } from '../../../domain/provider/password-hashing.provider.ts';
import { ArgumentInvalidException, NotMatchingPasswordException } from '../../../../shared/lib/exceptions.ts';

export interface UpdatePasswordCommand {
  userId: string;
  newPassword: string;
  currentPassword: string;
}

export class UpdatePasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashingProvider: PasswordHashingProvider,
  ) {}

  async handle(updatePasswordCommand: UpdatePasswordCommand): Promise<void> {
    if (!updatePasswordCommand.userId) {
      throw new ArgumentInvalidException('User id must be provided');
    }

    if (!updatePasswordCommand.newPassword) {
      throw new ArgumentInvalidException('New password must be provided');
    }

    if (!updatePasswordCommand.currentPassword) {
      throw new ArgumentInvalidException('Current password must be provided');
    }

    const user = await this.userRepository.get(updatePasswordCommand.userId);

    const isPasswordValid = await this.passwordHashingProvider.compare(updatePasswordCommand.currentPassword, user.password.value);
    if (!isPasswordValid) {
      throw new NotMatchingPasswordException();
    }

    user.updatePassword(updatePasswordCommand.newPassword);
    await this.userRepository.save(user);
  }
}
