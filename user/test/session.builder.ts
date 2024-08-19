import { Session } from '../domain/model/session.ts';

export const sessionBuilder = ({
  userId = crypto.randomUUID(),
  ip = '127.0.0.1',
  agent = 'Firefox',
  createdAt = new Date(),
  lastUsedAt = new Date(),
}: {
  userId?: string;
  ip?: string;
  agent?: string;
  createdAt?: Date;
  lastUsedAt?: Date;
} = {}) => {
  const props = { userId, ip, agent, createdAt, lastUsedAt };

  return {
    withUserId(_userId: string) {
      return sessionBuilder({ ...props, userId: _userId });
    },
    withIp(_ip: string) {
      return sessionBuilder({ ...props, ip: _ip });
    },
    withAgent(_agent: string) {
      return sessionBuilder({ ...props, agent: _agent });
    },
    createdAt(_createdAt: Date) {
      return sessionBuilder({ ...props, createdAt: _createdAt });
    },
    lastUsedAt(_lastUsedAt: Date) {
      return sessionBuilder({ ...props, lastUsedAt: _lastUsedAt });
    },
    build() {
      return Session.create(props);
    },
  };
};
