import { DateProvider } from './date.provider.ts';

export class StubDateProvider implements DateProvider {
  now: Date = new Date();

  constructor() {
  }

  getNow() {
    return this.now;
  }
}
