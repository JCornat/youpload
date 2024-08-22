import { User } from '../../model/user.ts';
import { PasswordHashingProvider } from '../../provider/password-hashing.provider.ts';
import { UserRepository } from '../../repository/user.repository.ts';
import { ExistingUserMailException, NotFoundException, NotMatchingPasswordException } from '../../../../shared/lib/exceptions.ts';
import { ReferralProvider } from '../../provider/referral.provider.ts';

export interface SignUpCommand {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export class SignUpUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashingProvider: PasswordHashingProvider,
    private readonly referralProvider: ReferralProvider,
  ) {}

  async handle(signUpCommand: SignUpCommand) {
    let user: User | undefined;

    try {
      user = await this.userRepository.getByEmail(signUpCommand.email);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    if (user) {
      throw new ExistingUserMailException();
    }

    if (signUpCommand.password !== signUpCommand.passwordRepeat) {
      throw new NotMatchingPasswordException();
    }

    const referral = await this.referralProvider.generate();
    const hashedPassword = await this.passwordHashingProvider.hash(signUpCommand.password);
    const props = {
      name: signUpCommand.name,
      email: signUpCommand.email,
      password: hashedPassword,
      referral,
    };

    const newUser = User.create(props);
    await this.userRepository.save(newUser);

    return newUser.id;
  }
}
