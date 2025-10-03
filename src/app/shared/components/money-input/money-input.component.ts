import { Component, forwardRef, Input, Optional, OnChanges, SimpleChanges } from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer,
  Validator, NG_VALIDATORS, AbstractControl, ValidationErrors
} from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

type CurrencyCode = 'UZS' | 'USD';

@Component({
  selector: 'app-money-input',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, InputTextModule, SelectModule],
  templateUrl: './money-input.component.html',
  styleUrls: ['../input/input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MoneyInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MoneyInputComponent), multi: true }
  ]
})
export class MoneyInputComponent implements ControlValueAccessor, Validator, OnChanges {
  constructor(@Optional() private controlContainer: ControlContainer) {}

  private readonly navKeys = new Set(['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Home','End']);

  @Input() formControlName!: string;
  @Input() placeholder = 'Miqdor';
  @Input() defaultCurrency: CurrencyCode = 'UZS';
  @Input() emitCurrency = false;

  @Input() required = false;
  @Input() min?: number;
  @Input() max?: number;
  @Input() requireCurrency = true;
  @Input() allowNegative = true;

  currency: CurrencyCode = 'UZS';
  displayValue = '';
  private amount: number | null = null;

  isDisabled = false;

  private onChangeCb: (v: any) => void = () => {};
  private onTouchedCb: () => void = () => {};
  private onValidatorChange?: () => void;

  currencyOptions = [
    { label: 'UZS', value: 'UZS' as CurrencyCode },
    { label: 'USD', value: 'USD' as CurrencyCode },
  ];

  writeValue(v: any): void {
    if (v && typeof v === 'object' && 'amount' in v) {
      this.amount = this.toNumber((v as any).amount);
      this.currency = ((v as any).currency as CurrencyCode) || this.defaultCurrency;
    } else {
      this.amount = this.toNumber(v);
      this.currency = this.defaultCurrency;
    }
    this.refreshDisplay();
  }
  registerOnChange(fn: any): void { this.onChangeCb = fn; }
  registerOnTouched(fn: any): void { this.onTouchedCb = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled = disabled; }

  validate(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    const currentAmount = (this.emitCurrency && val && typeof val === 'object') ? this.toNumber(val.amount) : this.toNumber(val);
    const currentCurrency: CurrencyCode | null =
      (this.emitCurrency && val && typeof val === 'object') ? (val.currency as CurrencyCode) : this.currency;

    if (this.required) {
      if (currentAmount === null || Number.isNaN(currentAmount)) {
        return { required: true };
      }
      if (this.emitCurrency && this.requireCurrency && !currentCurrency) {
        return { currencyMissing: true };
      }
    }

    if (currentAmount !== null && !Number.isNaN(currentAmount)) {
      if (typeof this.min === 'number' && currentAmount < this.min) {
        return { min: { min: this.min, actual: currentAmount } };
      }
      if (typeof this.max === 'number' && currentAmount > this.max) {
        return { max: { max: this.max, actual: currentAmount } };
      }
    }

    return null;
  }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['required'] || changes['min'] || changes['max'] || changes['requireCurrency'] || changes['allowNegative']) {
      this.onValidatorChange?.();
    }
  }

  get control() { return this.controlContainer?.control?.get?.(this.formControlName); }
  shouldShowErrors(): boolean {
    const c = this.control; return !!c && c.invalid && (c.dirty || c.touched);
  }

  onKeyDown(e: KeyboardEvent) {
    if (this.isDisabled) return;

    const el = e.target as HTMLInputElement;
    const value = el.value;
    const selStart = el.selectionStart ?? value.length;
    const selEnd = el.selectionEnd ?? value.length;
    const hasSelection = selStart !== selEnd;

    const ctrlMeta = e.ctrlKey || e.metaKey;
    if (this.navKeys.has(e.key) || (ctrlMeta && ['a','c','v','x'].includes(e.key.toLowerCase()))) {
      return;
    }

    const isDigit = /^[0-9]$/.test(e.key);
    const isDot = e.key === '.';
    const isMinus = e.key === '-';

    if (isMinus) {
      if (!this.allowNegative) { e.preventDefault(); return; }
      const alreadyMinus = value.startsWith('-') && !hasSelection;
      const atStart = selStart === 0;
      if (!atStart || alreadyMinus) e.preventDefault();
      return;
    }

    if (isDigit) return;

    if (isDot) {
      if (this.currency !== 'USD') { e.preventDefault(); return; }
      const current = hasSelection ? value.slice(0, selStart) + value.slice(selEnd) : value;
      if (current.includes('.')) { e.preventDefault(); return; }
      const before = current.slice(0, selStart);
      if (before.includes('.')) { e.preventDefault(); return; }
      return;
    }

    e.preventDefault();
  }

  onPaste(e: ClipboardEvent) {
    if (this.isDisabled) return;
    e.preventDefault();

    const text = (e.clipboardData?.getData('text') ?? '').trim();
    let sanitized = text.replace(/[^\d\.\-]/g, '');

    if (this.allowNegative) {
      sanitized = sanitized.replace(/(?!^)-/g, '');
    } else {
      sanitized = sanitized.replace(/-/g, '');
    }

    if (this.currency === 'UZS') {
      sanitized = sanitized.split('.')[0] || sanitized;
    } else {
      const parts = sanitized.split('.');
      sanitized = parts.shift() + (parts.length ? '.' + parts.join('') : '');
      const [intP, fracP = ''] = sanitized.split('.');
      sanitized = intP + (fracP ? '.' + fracP.slice(0, 2) : '');
    }

    (e.target as HTMLInputElement).value = sanitized;
    this.onAmountInput(e as unknown as Event);
  }

  onCurrencyChange(newCur: CurrencyCode) {
    this.currency = newCur;
    this.refreshDisplay();
    this.emitValue();
    this.onValidatorChange?.();
  }

  onAmountInput(e: Event) {
    const el = e.target as HTMLInputElement;
    let raw = el.value;

    raw = raw.replace(/[^\d\.\-]/g, '');

    if (this.allowNegative) raw = raw.replace(/(?!^)-/g, '');
    else raw = raw.replace(/-/g, '');

    if (this.currency === 'UZS') {
      raw = raw.split('.')[0] || raw;
    } else {
      const parts = raw.split('.');
      if (parts.length > 2) raw = parts.shift() + '.' + parts.join('');
      const [intPart, fracPart = ''] = raw.split('.');
      raw = intPart + (fracPart ? '.' + fracPart.slice(0, 2) : '');
    }

    this.amount = this.toNumber(raw);
    this.refreshDisplay();
    this.emitValue();
    this.onTouchedCb();
  }

  private toNumber(v: any): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  private format(amount: number | null, cur: CurrencyCode): string {
    if (amount === null) return '';
    if (cur === 'UZS') {
      return new Intl.NumberFormat('uz-UZ', { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).format(amount);
    }
  }

  private refreshDisplay() { this.displayValue = this.format(this.amount, this.currency); }
  private emitValue() {
    const out = this.emitCurrency ? { amount: this.amount, currency: this.currency } : this.amount;
    this.onChangeCb(out);
  }
}
