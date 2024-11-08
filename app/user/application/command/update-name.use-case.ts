import { UserRepository } from '@user/domain/repository/user.repository.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';
import { defaultUserRepository } from '@user/infrastructure/repository/user.fs.repository.ts';

export interface UpdateNameCommand {
  userId: string;
  newName: string;
}

export class UpdateNameUseCase {
  constructor(
    private readonly userRepository: UserRepository = defaultUserRepository,
  ) {}

  async handle(updateNameCommand: UpdateNameCommand): Promise<void> {
    if (!updateNameCommand.userId) {
      throw new ArgumentInvalidException('User id must be provided');
    }

    if (!updateNameCommand.newName) {
      throw new ArgumentInvalidException('New name must be provided');
    }

    const user = await this.userRepository.get(updateNameCommand.userId);

    user.updateName(updateNameCommand.newName);
    await this.userRepository.save(user);
  }
}

export const updateNameUseCase = new UpdateNameUseCase();
