import { TemporaryFile } from "../domain/temporary-file.ts";

export const temporaryFileBuilder = ({
  id = "MON-UUID-V4",
  name = "coucou.txt",
  size = 100,
  createdAt = new Date(),
}: {
  id?: string;
  name?: string;
  size?: number;
  createdAt?: Date;
} = {}) => {
  const props = { id, name, size, createdAt };

  return {
    withId(_id: string) {
      return temporaryFileBuilder({ ...props, id: _id });
    },
    withName(_name: string) {
      return temporaryFileBuilder({ ...props, name: _name });
    },
    withSize(_size: number) {
      return temporaryFileBuilder({ ...props, size: _size });
    },
    createdAt(_createdAt: Date) {
      return temporaryFileBuilder({ ...props, createdAt: _createdAt });
    },
    build() {
      return TemporaryFile.create(props);
    },
  };
};
