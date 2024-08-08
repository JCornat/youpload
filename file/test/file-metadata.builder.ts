import { FileMetadata } from '../domain/model/file-metadata.ts';

export const fileMetadataBuilder = ({
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
      return fileMetadataBuilder({ ...props, id: _id });
    },
    withName(_name: string) {
      return fileMetadataBuilder({ ...props, name: _name });
    },
    withSize(_size: number) {
      return fileMetadataBuilder({ ...props, size: _size });
    },
    createdAt(_createdAt: Date) {
      return fileMetadataBuilder({ ...props, createdAt: _createdAt });
    },
    expireAt(_expireAt: Date) {
      return fileMetadataBuilder({ ...props, expireAt: _expireAt });
    },
    build() {
      return FileMetadata.create(props);
    },
  };
};
