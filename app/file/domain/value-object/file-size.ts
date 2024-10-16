import { ValueObject } from '@shared/lib/value-object.ts';
import { ArgumentInvalidException } from '@shared/lib/exceptions.ts';

interface FileSizeProps {
  size: number;
}

export class FileSize extends ValueObject<FileSizeProps> {
  private constructor(props: FileSizeProps) {
    super(props);
  }

  static create(size: number): FileSize {
    if (size <= 0) {
      throw new ArgumentInvalidException('Invalid file size: value cannot be less or equal to 0');
    }

    return new FileSize({ size });
  }

  get value(): number {
    return this.props.size;
  }
}
