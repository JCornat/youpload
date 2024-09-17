import { Entity } from '../domain/model/entity.ts';
import { DomainEvent } from './events/domain-event.ts';
import { DomainEvents } from './events/domain-events.ts';

export abstract class AggregateRoot extends Entity {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
    this.logOnDomainEventAdded(domainEvent);
    DomainEvents.dispatch(domainEvent);
  }

  private logOnDomainEventAdded(domainEvent: DomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    console.info(`[Domain Event Created]:`, thisClass?.constructor.name, '==>', domainEventClass?.constructor.name);
  }
}
