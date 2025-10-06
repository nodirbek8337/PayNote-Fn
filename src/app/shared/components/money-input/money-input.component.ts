import { Component, forwardRef, Input, Optional } from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer,
  Validator, NG_VALIDATORS, AbstractControl, ValidationErrors
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MoneyPipe } from '../../pipes/money.pipe';

type CurrencyCode = 'UZS' | 'USD';

@Component({
  selector: 'app-money-input',
  standalone: true,
  imports: [NgIf, FormsModule, InputTextModule, SelectModule],
  providers: [
    MoneyPipe,
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MoneyInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MoneyInputComponent), multi: true }
  ],
  templateUrl: "./money-input.component.html",
  styleUrls: ["./money-input.component.scss"]
})
export class MoneyInputComponent implements ControlValueAccessor, Validator {
  constructor(
    @Optional() private controlContainer: ControlContainer,
    private money: MoneyPipe,
  ) {}

  @Input() formControlName!: string;
  @Input() placeholder = 'Miqdor';
  @Input() defaultCurrency: CurrencyCode = 'UZS';
  @Input() emitCurrency = false;

  @Input() required = false;
  @Input() min?: number;
  @Input() max?: number;
  @Input() requireCurrency = true;
  @Input() allowNegative = true;

  @Input() locale = 'uz-UZ';
  @Input() currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'narrowSymbol';

  currency: CurrencyCode = 'UZS';
  displayValue = '';
  private amount: number | null = null;
  private isEditing = false;

  isDisabled = false;

  private onChangeCb: (v: any) => void = () => {};
  private onTouchedCb: () => void = () => {};

  currencyOptions = [
    { label: 'UZS', value: 'UZS' as CurrencyCode },
    { label: 'USD', value: 'USD' as CurrencyCode },
  ];

  writeValue(v: any): void {
    if (v && typeof v === 'object' && 'amount' in v) {
      this.amount = this.toNumber(v.amount);
      this.currency = (v.currency as CurrencyCode) || this.defaultCurrency;
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
      if (currentAmount === null || Number.isNaN(currentAmount)) return { required: true };
      if (this.emitCurrency && this.requireCurrency && !currentCurrency) return { currencyMissing: true };
    }
    if (currentAmount !== null && !Number.isNaN(currentAmount)) {
      if (typeof this.min === 'number' && currentAmount < this.min) return { min: { min: this.min, actual: currentAmount } };
      if (typeof this.max === 'number' && currentAmount > this.max) return { max: { max: this.max, actual: currentAmount } };
    }
    return null;
  }

  get control() { return this.controlContainer?.control?.get?.(this.formControlName); }
  shouldShowErrors(): boolean {
    const c = this.control; return !!c && c.invalid && (c.dirty || c.touched);
  }

  onFocus() {
    this.isEditing = true;
    this.displayValue = this.toRawString(this.amount, this.currency);
  }

  onBlur() {
    this.isEditing = false;
    this.refreshDisplay();
    this.onTouchedCb();
  }

  onInput(raw: string) {
    this.displayValue = this.sanitize(raw, this.currency, this.allowNegative);
    this.amount = this.toNumber(this.displayValue);
    this.emitValue();
  }

  onCurrencyChange(newCur: CurrencyCode) {
    this.currency = newCur;
    this.refreshDisplay();
    this.emitValue();
  }

  private emitValue() {
    const out = this.emitCurrency ? { amount: this.amount, currency: this.currency } : this.amount;
    this.onChangeCb(out);
  }

  private toNumber(v: any): number | null {
    if (v === null || v === undefined || v === '') return null;
    if (v === '-' || v === '-.' || v === '.') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
    }

  private toRawString(amount: number | null, cur: CurrencyCode): string {
    if (amount === null) return '';
    return cur === 'UZS' ? String(Math.trunc(amount)) : String(amount);
  }

  private sanitize(raw: string, cur: CurrencyCode, allowNeg: boolean): string {
    let s = (raw ?? '').replace(/[^\d\.\-]/g, '');
    s = allowNeg ? s.replace(/(?!^)-/g, '') : s.replace(/-/g, '');

    if (cur === 'UZS') {
      s = s.split('.')[0] || s;
    } else {
      const m = s.match(/^-?\d*(?:\.\d{0,2})?/);
      s = m ? m[0] : '';
    }
    return s;
  }

  private refreshDisplay() {
    if (this.isEditing) {
      this.displayValue = this.toRawString(this.amount, this.currency);
    } else {
      this.displayValue = this.amount === null
        ? ''
        : this.money.transform(this.amount, this.currency, this.locale, this.currencyDisplay);
    }
  }
}
