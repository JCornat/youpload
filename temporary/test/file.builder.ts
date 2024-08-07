import { File } from '../domain/file.ts';

export const fileBuilder = ({
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
      return fileBuilder({ ...props, id: _id });
    },
    withName(_name: string) {
      return fileBuilder({ ...props, name: _name });
    },
    withSize(_size: number) {
      return fileBuilder({ ...props, size: _size });
    },
    createdAt(_createdAt: Date) {
      return fileBuilder({ ...props, createdAt: _createdAt });
    },
    expireAt(_expireAt: Date) {
      return fileBuilder({ ...props, expireAt: _expireAt });
    },
    build() {
      return File.create(props);
    },
  };
};
