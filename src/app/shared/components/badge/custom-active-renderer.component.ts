import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-active-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClass">{{ display }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomActiveBadgeComponent {
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

  @Input() trueLabel = 'Faol';
  @Input() falseLabel = 'Nofaol';
  @Input() nullLabel = '-';

  display = this.nullLabel;
  badgeClass = '';

  private recompute() {
    if (!this._rowData || !this._field) {
      this.display = this.nullLabel;
      this.badgeClass = 'px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 bg-gray-100';
      return;
    }

    const raw = this._rowData?.[this._field];

    if (raw === null || raw === undefined) {
      this.display = this.nullLabel;
      this.badgeClass = 'px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 bg-gray-100';
      return;
    }

    const val = typeof raw === 'string'
      ? raw.toLowerCase() === 'true'
      : !!raw;

    this.display = val ? this.trueLabel : this.falseLabel;
    this.badgeClass = val
      ? 'px-3 py-1.5 rounded-md text-sm font-medium text-green-600 bg-green-100'
      : 'px-3 py-1.5 rounded-md text-sm font-medium text-red-600 bg-red-100';
  }
}
