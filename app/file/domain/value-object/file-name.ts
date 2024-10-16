import { ValueObject } from '@shared/lib/value-object.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';

interface FileNameProps {
  name: string;
}

export class FileName extends ValueObject<FileNameProps> {
  private constructor(props: FileNameProps) {
    super(props);
  }

  static create(name: string): FileName {
    if (!this.isValid(name)) {
      throw new ArgumentInvalidException();
    }

    return new FileName({ name });
  }

  get value(): string {
    return this.props.name;
  }

  static isValid(value: string): boolean {
    if (!value || value.length > 255) {
      return false;
    }

    // Based on https://github.com/sindresorhus/filename-reserved-regex/blob/main/index.js
    const reg = /[<>:"/\\|?*\u0000-\u001F]/g;
    if (reg.test(value)) {
      return false;
    }

    const reg2 = /[^\.]*\.[^\.]+/;
    if (!reg2.test(value)) {
      return false;
    }

    return true;
  }
}
