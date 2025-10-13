import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money',
  standalone: true,
  pure: true,
})
export class MoneyPipe implements PipeTransform {
  transform(
    value: unknown,
    currency: string = 'UZS',
    locale: string = 'uz-UZ',
    currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'narrowSymbol'
  ): string {
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';

    const code = String(currency || 'UZS').toUpperCase();
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        currencyDisplay,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(n);
      return `${formatted} ${code}`;
    }
  }
}
