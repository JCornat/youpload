import { EntityId } from '../../domain/model/entity-id';
import { Time } from '../time';

export interface DomainEvent {
  dateTimeOccurred: Time;
  getAggregateId (): EntityId;
}
