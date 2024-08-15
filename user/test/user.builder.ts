import { User } from '../domain/model/user.ts';
import { UserEmail } from '../domain/value-object/user-email.ts';
import { UserName } from '../domain/value-object/user-name.ts';
import { UserPassword } from '../domain/value-object/user-password.ts';

export const userBuilder = ({
  id = crypto.randomUUID(),
  name = UserName.create('test'),
  email = UserEmail.create('test@test.com'),
  password = UserPassword.create('12345678'),
}: {
  id?: string;
  name?: UserName;
  email?: UserEmail;
  password?: UserPassword;
} = {}) => {
  const props = { id, name, email, password };

  return {
    withId(_id: string) {
      return userBuilder({ ...props, id: _id });
    },
    withName(_name: string) {
      const name = UserName.create(_name);
      return userBuilder({ ...props, name });
    },
    withEmail(_email: string) {
      const email = UserEmail.create(_email);
      return userBuilder({ ...props, email });
    },
    withPassword(_password: string) {
      const password = UserPassword.create(_password);
      return userBuilder({ ...props, password });
    },
    build() {
      return User.create(props);
    },
  };
};
