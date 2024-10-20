import { describe, it } from '@std/testing/bdd';
import { assertEquals } from '@std/assert';
import { sessionBuilder } from '@user/test/session.builder.ts';
import { Session } from '@user/domain/model/session.ts';

describe('Session', () => {
  describe('create', () => {
    it('shall create a FileMetadata with valid inputs', () => {
      const createdAt = new Date('2024-01-01 00:00:00');
      const lastUsedAt = new Date('2024-01-01 00:00:00');
      const payload = {
        userId: 'test',
        ip: '127.0.0.1',
        agent: 'Firefox',
        createdAt: createdAt.toISOString(),
        lastUsedAt: lastUsedAt.toISOString(),
      };

      const session = Session.create(payload);

      const expectedSession = sessionBuilder()
        .withId(session.id)
        .withUserId(payload.userId)
        .withIp(payload.ip)
        .withAgent(payload.agent)
        .createdAt(createdAt)
        .lastUsedAt(lastUsedAt)
        .build();

      assertEquals(expectedSession, session);
    });
  });
});
