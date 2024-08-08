import { DomainEvent } from './domain-event.ts';

type DomainCallback = (event: DomainEvent) => void;

export class DomainEvents {
  private static subscriptionsMap = new Map<string, DomainCallback[]>();

  static register(callback: DomainCallback, eventClassName: string): void {
    if (!this.subscriptionsMap.has(eventClassName)) {
      this.subscriptionsMap.set(eventClassName, []);
    }

    this.subscriptionsMap.get(eventClassName)!.push(callback);
  }

  static clearSubscriptions() {
    this.subscriptionsMap.clear();
  }

  static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name;

    if (this.subscriptionsMap.has(eventClassName)) {
      const subscriptions: DomainCallback[] | undefined = this.subscriptionsMap.get(eventClassName);
      if (!subscriptions) {
        return;
      }

      for (const subscription of subscriptions) {
        subscription(event);
      }
    }
  }
}
