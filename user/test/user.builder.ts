import { User } from '../domain/model/user.ts';

export const userBuilder = ({
  id = crypto.randomUUID(),
  name = 'test',
  email = 'test@test.com',
  password = '12345678',
}: {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
} = {}) => {
  const props = { id, name, email, password };

  return {
    withId(_id: string) {
      return userBuilder({ ...props, id: _id });
    },
    withName(_name: string) {
      return userBuilder({ ...props, name: _name });
    },
    withEmail(_email: string) {
      return userBuilder({ ...props, email: _email });
    },
    withPassword(_password: string) {
      return userBuilder({ ...props, password: _password });
    },
    build() {
      return User.reconstitute(props);
    },
  };
};
