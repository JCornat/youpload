import { PasswordHashingProvider } from '@user/domain/provider/password-hashing.provider.ts';

export class PasswordHashingFakeRepository implements PasswordHashingProvider {
  compare(value: string, hash: string): Promise<boolean> {
    return Promise.resolve(value === hash);
  }

  hash(value: string): Promise<string> {
    return Promise.resolve(value);
  }
}
