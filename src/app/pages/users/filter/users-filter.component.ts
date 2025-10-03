import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DatepickerRangeComponent } from '../../../shared/components/datepicker-range/datepicker-range.component';

type FilterType = 'dropdown' | 'date-range' | 'text';

@Component({
  selector: 'users-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, InputTextModule, DatepickerRangeComponent],
  template: `
    <div class="p-3" style="display:grid; grid-template-columns:1fr; gap:12px">
      <ng-container *ngFor="let col of columnDefs">
        <ng-container *ngIf="col?.searchable !== false">
          <div>
            <ng-container *ngIf="col.filterType === 'dropdown'">
              <p-select
                [options]="col.filterOptions"
                optionLabel="label"
                optionValue="value"
                styleClass="user-select"
                [placeholder]="resolvePlaceholder(col, 'dropdown')"
                [style.width.%]="100"
                [(ngModel)]="columnFilters[col.field]"
                (onChange)="onColumnFilter($event.value, col.field)"
                [showClear]="true"
              ></p-select>
            </ng-container>

            <ng-container *ngIf="col.filterType === 'date-range'">
              <datepicker-range
                [value]="columnFilters[col.field]"
                (valueChange)="onColumnFilter($event, col.field)"
                [placeholder]="resolvePlaceholder(col, 'date-range')">
              </datepicker-range>
            </ng-container>

            <ng-container *ngIf="!col.filterType || col.filterType === 'text'">
              <input
                pInputText
                type="text"
                style="height: 40px;"
                [style.width.%]="100"
                [placeholder]="resolvePlaceholder(col, 'text')"
                [(ngModel)]="columnFilters[col.field]"
                (ngModelChange)="onColumnFilter($event, col.field)"
              />
            </ng-container>
          </div>
        </ng-container>
      </ng-container>

      <div class="mt-3 flex justify-content-between">
        <button
          pButton
          class="p-button-secondary"
          icon="pi pi-filter-slash"
          label="Tozalash"
          (click)="clearAllFilters()"
          [disabled]="loading || isFilterEmpty()">
        </button>
      </div>
    </div>
  `
})
export class UsersFilterComponent {
  @Input() columnDefs: any[] = [];
  @Input() columnFilters: Record<string, any> = {};
  @Input() loading = false;

  @Input() quickText: string = '';

  @Input() translateFn?: (key: string) => string;

  @Input() onColumnFilter!: (value: any, field: string) => void;
  @Input() clearAllFilters!: () => void;

  @Input() defaultPlaceholders: Record<FilterType, string> = {
    'dropdown':  'Tanlash',
    'date-range':'Vaqt oraliqi',
    'text':      'Qidirish...'
  };

  isFilterEmpty(): boolean {
    return Object.keys(this.columnFilters || {}).length === 0;
  }

  resolvePlaceholder(col: any, type: FilterType): string {
    let base =
      (col?.placeholderKey && typeof this.translateFn === 'function'
        ? (this.translateFn(col.placeholderKey) || '')
        : '') ||
      (typeof col?.placeholder === 'string' && col.placeholder.trim() !== '' ? col.placeholder : '') ||
      this.defaultPlaceholders[type] || '';

    if (typeof col?.placeholderTemplate === 'string' && col.placeholderTemplate.length) {
      return col.placeholderTemplate
        .replace('{base}', base)
        .replace('{q}', this.quickText || '')
        .replace('{header}', col?.header ?? '');
    }

    if (this.quickText) {
      return `${base} (${this.quickText})`;
    }

    return base;
  }
}
