import { TemporaryFile } from '../domain/temporary-file.ts';

export const temporaryFileBuilder = ({
  id = crypto.randomUUID(),
  name = 'coucou.txt',
  size = 100,
  createdAt = new Date(),
  expireAt = new Date('2030-01-01T00:00:00.000Z'),
}: {
  id?: string;
  name?: string;
  size?: number;
  createdAt?: Date;
  expireAt?: Date;
} = {}) => {
  const props = { id, name, size, createdAt, expireAt };

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
    expireAt(_expireAt: Date) {
      return temporaryFileBuilder({ ...props, expireAt: _expireAt });
    },
    build() {
      return TemporaryFile.create(props);
    },
  };
};
