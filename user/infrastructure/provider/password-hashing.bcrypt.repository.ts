import { PasswordHashingProvider } from '../../domain/provider/password-hashing.provider.ts';
import * as bcrypt from 'bcrypt';
import { ArgumentInvalidException } from '../../../shared/lib/exceptions.ts';

export class PasswordHashingBcryptRepository implements PasswordHashingProvider {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async hash(password: string): Promise<string> {
    if (!password) {
      throw new ArgumentInvalidException('Password cannot be empty');
    }

    if (typeof password !== 'string') {
      throw new ArgumentInvalidException('Password should be a string');
    }

    if (password.length < 8) {
      throw new ArgumentInvalidException('Password should be at least 8 characters');
    }

    if (password.length > 50) {
      throw new ArgumentInvalidException('Password should be at most 50 characters');
    }

    const salt = await bcrypt.genSalt(8);
    return await bcrypt.hash(password, salt);
  }
}
