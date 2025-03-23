import { DateProvider } from '@shared/domain/provider/date.provider.ts';

export class DateNativeProvider implements DateProvider {
  getNow() {
    return new Date();
  }
}

export const defaultDateProvider = new DateNativeProvider();
