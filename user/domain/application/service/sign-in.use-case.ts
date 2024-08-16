export interface SignInCommand {
  email: string;
  password: string;
  ip: string;
  agent: string;
}

export class SignInUseCase {
  handle(signInCommand: SignInCommand) {
    return '';
  }
}