import { User } from '@user/domain/model/user.ts';
import { PasswordHashingProvider } from '@user/domain/provider/password-hashing.provider.ts';
import { UserRepository } from '@user/domain/repository/user.repository.ts';
import { ExistingUserMailException, NotFoundException, NotMatchingPasswordException } from '@shared/lib/exceptions.ts';
import { ReferralProvider } from '@user/domain/provider/referral.provider.ts';
import { defaultUserRepository } from '@user/infrastructure/repository/user.fs.repository.ts';
import { defaultPasswordHashingProvider } from '@user/infrastructure/provider/password-hashing.bcrypt.repository.ts';
import { defaultReferralProvider } from '@user/infrastructure/provider/referral-slug.provider.ts';

export interface SignUpCommand {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
  referral: string;
}

export class SignUpUseCase {
  constructor(
    private readonly userRepository: UserRepository = defaultUserRepository,
    private readonly passwordHashingProvider: PasswordHashingProvider = defaultPasswordHashingProvider,
    private readonly referralProvider: ReferralProvider = defaultReferralProvider,
  ) {}

  async handle(signUpCommand: SignUpCommand) {
    let user: User | undefined;

    try {
      await this.userRepository.getByReferral(signUpCommand.referral);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Referral not found');
      }

      throw error;
    }

    try {
      user = await this.userRepository.getByEmail(signUpCommand.email);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    if (user) {
      throw new ExistingUserMailException('Mail already taken');
    }

    if (signUpCommand.password !== signUpCommand.passwordRepeat) {
      throw new NotMatchingPasswordException('Passwords do not match');
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
