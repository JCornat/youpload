import { User } from '../../model/user.ts';
import { PasswordHashingProvider } from '../../provider/password-hashing.provider.ts';
import { UserRepository } from '../../repository/user.repository.ts';
import * as bcrypt from 'bcrypt';

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

    try {
      const salt = await bcrypt.genSalt(8);
      const hash = await bcrypt.hash(signUpCommand.password, salt);
      console.log('encryptPassword', hash);
    } catch (e) {
      console.error(e);
    }

    const hashedPassword = await this.passwordHashingProvider.hash(signUpCommand.password);
    const newUser = User.create({ id, name: signUpCommand.name, email: signUpCommand.email, password: hashedPassword });
    await this.userRepository.save(newUser);

    return id;
  }
}
