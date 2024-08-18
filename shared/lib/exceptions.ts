import { ExceptionBase } from './exception.base.ts';

export class ArgumentNotProvidedException extends ExceptionBase {}
export class ArgumentInvalidException extends ExceptionBase {}
export class ArgumentOutOfRangeException extends ExceptionBase {}
export class NotFoundException extends ExceptionBase {}
export class ParseErrorException extends ExceptionBase {}
export class ExpiredFileException extends ExceptionBase {}
export class ExistingUserMailException extends ExceptionBase {}
export class NotMatchingPasswordException extends ExceptionBase {}
export class AuthenticationFailedException extends ExceptionBase {}
