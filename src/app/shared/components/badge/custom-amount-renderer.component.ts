import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-amount-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="colorClass">{{ display }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomAmountRendererComponent {
  private _rowData: any;
  private _field!: string;

  @Input() set rowData(v: any) {
    this._rowData = v;
    this.recompute();
  }
  get rowData() { return this._rowData; }

  @Input() set field(v: string) {
    this._field = v;
    this.recompute();
  }
  get field() { return this._field; }

  @Input() locale = 'uz-UZ';
  @Input() currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'narrowSymbol';

  display = '-';
  colorClass = 'text-gray-500';

  private recompute() {
    if (!this._rowData || !this._field) {
      this.display = '-';
      this.colorClass = 'text-gray-500';
      return;
    }

    const raw = this._rowData?.[this._field];
    const n = Number(raw);

    if (!Number.isFinite(n)) {
      this.display = '-';
      this.colorClass = 'text-gray-500';
      return;
    }

    const code =
      this._rowData?.[`${this._field}Currency`] ??
      this._rowData?.currency ??
      this._rowData?.currencyCode ??
      'UZS';

    this.colorClass = n < 0 ? 'text-red-500' : (n === 0 ? 'text-gray-500' : 'text-green-600');

    try {
      this.display = new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: String(code).toUpperCase(),
        currencyDisplay: this.currencyDisplay
      }).format(n);
    } catch {
      const formatted = new Intl.NumberFormat(this.locale).format(n);
      this.display = `${formatted} ${code}`;
    }
  }
}
