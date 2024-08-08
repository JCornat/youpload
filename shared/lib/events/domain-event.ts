import { EntityId } from '../../domain/model/entity-id.ts';

export interface DomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): EntityId;
}
