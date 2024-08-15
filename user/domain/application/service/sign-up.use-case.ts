import { User } from '../../model/user.ts';
import { PasswordHashingProvider } from '../../provider/password-hashing.provider.ts';
import { UserRepository } from '../../repository/user.repository.ts';
import { UserName } from '../../value-object/user-name.ts';
import { UserEmail } from '../../value-object/user-email.ts';
import { UserPassword } from '../../value-object/user-password.ts';
import { ExistingUserMailException } from '../../../../shared/lib/exceptions.ts';

export interface SignUpCommand {
  name: string;
  email: string;
  password: string;
}

export class SignUpUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashingProvider: PasswordHashingProvider,
  ) {}

  async handle(signUpCommand: SignUpCommand) {
    const id = crypto.randomUUID();

    const users = await this.userRepository.getAllByEmail(signUpCommand.email);
    if (users.length > 0) {
      throw new ExistingUserMailException();
    }

    const name = UserName.create(signUpCommand.name);
    const email = UserEmail.create(signUpCommand.email);
    const hashedPassword = await this.passwordHashingProvider.hash(signUpCommand.password);
    const password = UserPassword.create(hashedPassword);
    const newUser = User.create({ id, name, email, password });
    await this.userRepository.save(newUser);

    return id;
  }
}
