import { FileMetadata } from '../domain/model/file-metadata.ts';
import { FileSize } from '../domain/value-object/file-size.ts';
import { FileName } from '../domain/value-object/file-name.ts';

export const fileMetadataBuilder = ({
  id = crypto.randomUUID(),
  name = FileName.create('coucou.txt'),
  size = FileSize.create(100),
  createdAt = new Date(),
  expireAt = new Date('2030-01-01T00:00:00.000Z'),
}: {
  id?: string;
  name?: FileName;
  size?: FileSize;
  createdAt?: Date;
  expireAt?: Date;
} = {}) => {
  const props = { id, name, size, createdAt, expireAt };

  return {
    withId(_id: string) {
      return fileMetadataBuilder({ ...props, id: _id });
    },
    withName(_name: string) {
      const name = FileName.create(_name);
      return fileMetadataBuilder({ ...props, name });
    },
    withSize(_size: number) {
      const size = FileSize.create(_size);
      return fileMetadataBuilder({ ...props, size });
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
