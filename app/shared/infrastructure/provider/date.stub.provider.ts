import { DateProvider } from '@shared/domain/provider/date.provider.ts';

export class DateStubProvider implements DateProvider {
  now: Date = new Date();

  getNow() {
    return this.now;
  }
}
