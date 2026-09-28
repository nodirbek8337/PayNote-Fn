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
    _currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'code'
  ): string {
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';

    const code = String(currency || 'UZS').toUpperCase();
    try {
      const formatted = new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: code === 'USD' ? 2 : 0,
        maximumFractionDigits: code === 'USD' ? 2 : 0,
      }).format(n);
      return `${code} ${formatted}`;
    } catch {
      const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(n);
      return `${code} ${formatted}`;
    }
  }
}
