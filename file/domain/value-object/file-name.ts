import {ValueObject} from "../../../shared/lib/value-object.ts";
import {ArgumentInvalidException} from "../../../shared/lib/exceptions.ts";

interface FileNameProps {
  name: string;
}

export class FileName extends ValueObject<FileNameProps> {
  private constructor(props: FileNameProps) {
    super(props);
  }

  static create(name: string): FileName {
    if (name?.length < 0) {
      throw new ArgumentInvalidException('Invalid file name: Length cannot be less or equal to 0')
    }

    if (name.length > 50) {
      throw new ArgumentInvalidException('Invalid file name: Length cannot be greater than 50');
    }

    return new FileName({name})
  }

  get value(): string {
    return this.props.name;
  }
}