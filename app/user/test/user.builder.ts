import { User } from '../domain/model/user.ts';

export const userBuilder = ({
  id = crypto.randomUUID(),
  name = 'test',
  email = 'default@email.com',
  password = '12345678',
  referral = 'AAAAA-AAAAA-AAAAA',
}: {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  referral?: string;
} = {}) => {
  const props = { id, name, email, password, referral };

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
    withReferral(_referral: string) {
      return userBuilder({ ...props, referral: _referral });
    },
    build() {
      return User.reconstitute(props);
    },
  };
};
