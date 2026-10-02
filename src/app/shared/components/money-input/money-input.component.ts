import { Component, EventEmitter, Output, forwardRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MoneyPipe } from '../../pipes/money.pipe';
import { ControlErrorComponent } from '../control-error/control-error.component';
import { MONEY_ERROR_MESSAGES } from '../../constants/control-error-messages';
import { NoAutofillDirective } from '../../directives/no-autofill.directive';

type CurrencyCode = 'UZS' | 'USD';

@Component({
    selector: 'app-money-input',
    standalone: true,
    imports: [FormsModule, InputTextModule, Select, ControlErrorComponent, NoAutofillDirective],
    providers: [MoneyPipe, { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MoneyInputComponent), multi: true }, { provide: NG_VALIDATORS, useExisting: forwardRef(() => MoneyInputComponent), multi: true }],
    templateUrl: './money-input.component.html',
    styleUrls: ['./money-input.component.scss']
})
export class MoneyInputComponent implements ControlValueAccessor, Validator, OnChanges {
    private controlContainer = inject(ControlContainer, { optional: true });
    private money = inject(MoneyPipe);

    @Input() formControlName!: string;
    @Input() placeholder = 'Miqdor';
    @Input() defaultCurrency: CurrencyCode = 'UZS';
    @Input() emitCurrency = false;
    @Output() currencyChanged = new EventEmitter<CurrencyCode>();

    @Input() required = false;
    @Input() min?: number;
    @Input() max?: number;
    @Input() requireCurrency = true;
    @Input() allowNegative = false;

    @Input() locale = 'uz-UZ';
    @Input() currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'narrowSymbol';

    currency: CurrencyCode = 'UZS';
    displayValue = '';
    private amount: number | null = null;
    private isEditing = false;

    isDisabled = false;
    readonly errorMessages = MONEY_ERROR_MESSAGES;

    private onChangeCb: (v: any) => void = () => {};
    private onTouchedCb: () => void = () => {};

    currencyOptions = [
        { label: 'UZS', value: 'UZS' as CurrencyCode },
        { label: 'USD', value: 'USD' as CurrencyCode }
    ];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['defaultCurrency'] && !this.emitCurrency) {
            this.currency = this.defaultCurrency;
            if (this.currency === 'UZS' && this.amount !== null && !Number.isInteger(this.amount)) {
                this.amount = Math.trunc(this.amount);
                this.emitValue();
            }
            this.refreshDisplay();
        }
    }

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
    registerOnChange(fn: any): void {
        this.onChangeCb = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouchedCb = fn;
    }
    setDisabledState(disabled: boolean): void {
        this.isDisabled = disabled;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        const val = control.value;
        const currentAmount = this.emitCurrency && val && typeof val === 'object' ? this.toNumber(val.amount) : this.toNumber(val);
        const currentCurrency: CurrencyCode | null = this.emitCurrency && val && typeof val === 'object' ? (val.currency as CurrencyCode) : this.currency;

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

    get control() {
        return this.controlContainer?.control?.get?.(this.formControlName);
    }
    shouldShowErrors(): boolean {
        const c = this.control;
        return !!c && c.invalid && (c.dirty || c.touched);
    }

    onFocus() {
        this.isEditing = true;
        this.displayValue = this.formatEditingValue(this.amount);
    }

    onBlur() {
        this.isEditing = false;
        this.refreshDisplay();
        this.onTouchedCb();
    }

    onInput(raw: string) {
        const sanitized = this.sanitize(raw, this.allowNegative);
        this.amount = this.toNumber(sanitized);
        this.displayValue = this.formatRawString(sanitized);
        this.emitValue();
    }

    onCurrencyChange(newCur: CurrencyCode) {
        this.currency = newCur;
        if (newCur === 'UZS' && this.amount !== null) this.amount = Math.trunc(this.amount);
        this.refreshDisplay();
        this.emitValue();
        this.currencyChanged.emit(newCur);
    }

    private emitValue() {
        const out = this.emitCurrency ? { amount: this.amount, currency: this.currency } : this.amount;
        this.onChangeCb(out);
    }

    private toNumber(v: any): number | null {
        if (v === null || v === undefined || v === '') return null;
        if (v === '-') return null;
        const n = typeof v === 'number' ? v : Number(this.currency === 'USD' ? String(v).replace(/,/g, '') : String(v).replace(/\./g, ''));
        if (!Number.isFinite(n)) return null;
        return this.currency === 'USD' ? Number(n.toFixed(2)) : Math.trunc(n);
    }

    private toRawString(amount: number | null): string {
        if (amount === null) return '';
        return String(this.currency === 'USD' ? amount : Math.trunc(amount));
    }

    private sanitize(raw: string, allowNeg: boolean): string {
        if (this.currency === 'USD') {
            let value = (raw ?? '').replace(/,/g, '').replace(/[^\d.\-]/g, '');
            value = allowNeg ? value.replace(/(?!^)-/g, '') : value.replace(/-/g, '');
            const negative = value.startsWith('-');
            const [whole, ...fraction] = value.replace(/^-/, '').split('.');
            return `${negative ? '-' : ''}${fraction.length ? `${whole || '0'}.${fraction.join('').slice(0, 2)}` : whole}`;
        }
        let s = (raw ?? '').replace(/[^\d-]/g, '');
        s = allowNeg ? s.replace(/(?!^)-/g, '') : s.replace(/-/g, '');
        s = s.replace(/^(-?)0+(?=\d)/, '$1');
        return s;
    }

    private formatEditingValue(amount: number | null): string {
        return this.formatRawString(this.toRawString(amount));
    }

    private formatRawString(raw: string): string {
        if (!raw || raw === '-') return raw;

        if (this.currency === 'USD') return raw;

        const isNegative = raw.startsWith('-');
        const digits = raw.replace(/[^\d]/g, '');
        const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `${isNegative ? '-' : ''}${formatted}`;
    }

    private refreshDisplay() {
        if (this.isEditing) {
            this.displayValue = this.formatEditingValue(this.amount);
        } else {
            this.displayValue = this.amount === null ? '' : this.money.transform(this.amount, this.currency, this.locale, this.currencyDisplay);
        }
    }
}
