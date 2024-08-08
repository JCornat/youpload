import { EntityId } from '../../../shared/domain/model/entity-id.ts';
import {DomainEvent} from "../../../shared/lib/events/domain-event.ts";

export class FileExpiredEvent implements DomainEvent {
  dateTimeOccurred: Date;

  constructor(private aggregateId: EntityId) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): EntityId {
    return this.aggregateId;
  }
}