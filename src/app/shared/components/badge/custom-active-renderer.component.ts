import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-active-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClass">{{ display }}</span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 64px;
      padding: 0.32rem 0.7rem;
      border-radius: 8px;
      font-size: 0.86rem;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: 0;
    }

    .status-badge.active {
      color: var(--status-active-text);
      background: var(--status-active-bg);
      border: 1px solid var(--status-active-border);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--status-active-border) 18%, transparent);
    }

    .status-badge.inactive {
      color: var(--status-inactive-text);
      background: var(--status-inactive-bg);
      border: 1px solid var(--status-inactive-border);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--status-inactive-border) 18%, transparent);
    }

    .status-badge.empty {
      color: var(--status-empty-text);
      background: var(--status-empty-bg);
      border: 1px solid var(--status-empty-border);
    }
  `],
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
  @Input() falseLabel = 'Faol emas';
  @Input() nullLabel = '-';

  display = this.nullLabel;
  badgeClass = '';

  private recompute() {
    if (!this._rowData || !this._field) {
      this.display = this.nullLabel;
      this.badgeClass = 'status-badge empty';
      return;
    }

    const raw = this._rowData?.[this._field];

    if (raw === null || raw === undefined) {
      this.display = this.nullLabel;
      this.badgeClass = 'status-badge empty';
      return;
    }

    const val = typeof raw === 'string'
      ? raw.toLowerCase() === 'true'
      : !!raw;

    this.display = val ? this.trueLabel : this.falseLabel;
    this.badgeClass = val ? 'status-badge active' : 'status-badge inactive';
  }
}
