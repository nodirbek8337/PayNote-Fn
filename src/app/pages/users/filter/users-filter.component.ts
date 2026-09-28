import { Component, Input } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { DatepickerRangeComponent } from '../../../shared/components/datepicker-range/datepicker-range.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';

type FilterType = 'dropdown' | 'date-range' | 'number-range' | 'text';

@Component({
    selector: 'users-filter',
    standalone: true,
    imports: [FormsModule, ButtonDirective, DatepickerRangeComponent, InputComponent, SelectComponent],
    template: `
        <div class="users-filter">
            @for (col of columnDefs; track col) {
                @if (col?.searchable !== false) {
                    <div>
                        @if (col.filterType === 'dropdown') {
                            <app-select
                                [options]="col.filterOptions"
                                optionLabel="label"
                                optionValue="value"
                                [placeholder]="resolvePlaceholder(col, 'dropdown')"
                                [(ngModel)]="columnFilters[col.field]"
                                (ngModelChange)="onColumnFilter($event, col.field)"
                                [showClear]="true"
                            ></app-select>
                        }
                        @if (col.filterType === 'date-range') {
                            <datepicker-range [value]="columnFilters[col.field]" (valueChange)="onColumnFilter($event, col.field)" [placeholder]="resolvePlaceholder(col, 'date-range')"> </datepicker-range>
                        }
                        @if (col.filterType === 'number-range') {
                            <div class="users-filter__number-range">
                                <app-input
                                    type="number"
                                    placeholder="Eng kam miqdor"
                                    [ngModel]="getNumberRangeValue(col.field, 0)"
                                    (ngModelChange)="onNumberRangeChange($event, col.field, 0)"
                                ></app-input>
                                <app-input
                                    type="number"
                                    placeholder="Eng ko'p miqdor"
                                    [ngModel]="getNumberRangeValue(col.field, 1)"
                                    (ngModelChange)="onNumberRangeChange($event, col.field, 1)"
                                ></app-input>
                            </div>
                        }
                        @if (!col.filterType || col.filterType === 'text') {
                            <app-input
                                [placeholder]="resolvePlaceholder(col, 'text')"
                                [(ngModel)]="columnFilters[col.field]"
                                (ngModelChange)="onColumnFilter($event, col.field)"
                            ></app-input>
                        }
                    </div>
                }
            }

            <div class="users-filter__footer">
                <button pButton type="button" class="p-button-secondary filter-clear-btn" (click)="onClearFilters()" [disabled]="loading || isFilterEmpty()"><i class="pi pi-filter-slash" aria-hidden="true"></i><span>Tozalash</span></button>
            </div>
        </div>
    `,
    styles: [
        `
            .users-filter {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
                min-width: 0;
                max-width: 100%;
            }

            .users-filter > div {
                min-width: 0;
                max-width: 100%;
            }

            .users-filter app-input {
                display: block;
                width: 100%;
            }

            .users-filter__footer {
                display: flex;
                justify-content: stretch;
                padding-top: 0.35rem;
            }

            .users-filter__number-range {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                gap: 0.5rem;
            }

            .users-filter__number-range app-input {
                width: 100%;
                min-width: 0;
            }

            :host ::ng-deep .filter-clear-btn.p-button {
                width: 100%;
                justify-content: center;
            }
        `
    ]
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
        dropdown: 'Tanlang',
        'date-range': 'Vaqt oraligini tanlang',
        'number-range': 'Miqdor oraligini kiriting',
        text: 'Qidiring...'
    };

    isFilterEmpty(): boolean {
        return !Object.values(this.columnFilters || {}).some((value) => {
            if (Array.isArray(value)) return value.length > 0;
            return value !== null && value !== undefined && value !== '';
        });
    }

    onClearFilters(): void {
        this.columnFilters = {};
        this.clearAllFilters?.();
    }

    getNumberRangeValue(field: string, index: 0 | 1): number | null {
        const value = this.columnFilters?.[field];
        return Array.isArray(value) && typeof value[index] === 'number' ? value[index] : null;
    }

    onNumberRangeChange(value: string | number | null, field: string, index: 0 | 1): void {
        const current = this.columnFilters?.[field];
        const range: [number | null, number | null] = Array.isArray(current) ? [current[0] ?? null, current[1] ?? null] : [null, null];
        const numberValue = value === '' || value === null || value === undefined ? null : Number(value);
        range[index] = Number.isFinite(numberValue) && Number(numberValue) >= 0 ? Number(numberValue) : null;

        this.onColumnFilter(range[0] === null && range[1] === null ? null : range, field);
    }

    resolvePlaceholder(col: any, type: FilterType): string {
        let base =
            (col?.placeholderKey && typeof this.translateFn === 'function' ? this.translateFn(col.placeholderKey) || '' : '') ||
            (typeof col?.placeholder === 'string' && col.placeholder.trim() !== '' ? col.placeholder : '') ||
            this.defaultPlaceholders[type] ||
            '';

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
