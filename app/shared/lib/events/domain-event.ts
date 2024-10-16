import { EntityId } from '@shared/domain/model/entity-id.ts';

export interface DomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): EntityId;
}
