import { Component, forwardRef, Input, OnInit, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ControlErrorComponent } from '../control-error/control-error.component';
import { INPUT_ERROR_MESSAGES } from '../../constants/control-error-messages';
import { NoAutofillDirective } from '../../directives/no-autofill.directive';

let nextInputId = 0;

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [NgClass, InputTextModule, FormsModule, ControlErrorComponent, NoAutofillDirective],
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})
export class InputComponent implements ControlValueAccessor, OnInit {
    private controlContainer = inject(ControlContainer, { optional: true });

    @Input() type: 'text' | 'password' | 'email' | 'number' | 'datetime-local' = 'text';
    @Input() placeholder = '';
    @Input() formControlName!: string;
    @Input() required = false;
    @Input() allowMathExpression = false;
    @Input() allowNegative = false;
    @Input() decimalPlaces = 0;
    @Input() disabled = false;
    @Input() autocomplete = '';
    @Input() allowAutofill = false;
    @Input() inputName = '';
    @Input() inputId = `paynote-field-${++nextInputId}`;

    get inputAutocomplete(): string {
        return this.autocomplete || (this.type === 'password' ? 'new-password' : 'off');
    }

    value: any = '';
    isDisabled = false;
    showPassword = false;
    readonly errorMessages = INPUT_ERROR_MESSAGES;

  onChange = (_value?: any) => {};
    onTouched = () => {};

    ngOnInit(): void {
        const validator = this.control?.validator?.({} as any);
        this.required ||= !!validator?.['required'];
    }

    writeValue(val: any): void {
        if (this.type !== 'number') {
            this.value = val;
            return;
        }

        if (this.decimalPlaces > 0) {
            this.value = this.sanitizeDecimalExpression(val);
            return;
        }

        this.value = this.allowMathExpression ? this.formatNumberExpressionValue(val) : this.formatNumberValue(val);
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState(disabled: boolean): void {
        this.isDisabled = disabled;
    }

    get control() {
        return this.controlContainer?.control?.get?.(this.formControlName);
    }

    shouldShowErrors(): boolean {
        const c = this.control;
        return !!c && c.invalid && (c.dirty || c.touched);
    }

    handleValueChange(value: any): void {
        if (this.type !== 'number') {
            this.value = value;
            this.onChange(value);
            return;
        }

        if (this.decimalPlaces > 0) {
            const raw = this.sanitizeDecimalExpression(value);
            this.value = raw;
            this.onChange(raw);
            return;
        }

        if (this.allowMathExpression) {
            const raw = this.sanitizeNumberExpression(value);
            this.value = this.formatNumberExpression(raw);
            this.onChange(raw);
            return;
        }

        const raw = this.sanitizeNumber(value);
        this.value = this.formatNumberRaw(raw);
        this.onChange(raw === '' || raw === '-' ? null : Number(raw));
    }

    handleNativeInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (this.type !== 'number') {
            this.handleValueChange(input.value);
            return;
        }

        this.handleValueChange(input.value);
        if (input.value !== this.value) input.value = this.value;
    }

    handleBlur(): void {
        if (this.type === 'number' && this.decimalPlaces > 0) {
            const match = String(this.value ?? '').match(/^(-?\d+(?:\.\d+)?)(?:([+-])(\d+(?:\.\d+)?))?$/);
            if (match) {
                const result = Number(match[1]) + (match[2] === '+' ? Number(match[3]) : match[2] === '-' ? -Number(match[3]) : 0);
                if (Number.isFinite(result) && (this.allowNegative || result >= 0)) {
                    const rounded = Number(result.toFixed(this.decimalPlaces));
                    this.value = String(rounded);
                    this.onChange(rounded);
                }
            }
        } else if (this.type === 'number' && this.allowMathExpression) {
            const result = this.evaluateNumberExpression(this.value);

            if (result !== null && (this.allowNegative || result >= 0)) {
                this.value = this.formatNumberRaw(String(result));
                this.onChange(result);
            }
        }

        this.onTouched();
    }

    get nativeInputType(): string {
        return this.type === 'number' ? 'text' : this.type;
    }

    get inputMode(): string | null {
        return this.type === 'number' ? (this.decimalPlaces > 0 ? 'decimal' : this.allowMathExpression ? 'text' : 'numeric') : null;
    }

    togglePasswordVisibility(): void {
        if (this.isDisabled || this.disabled) return;
        this.showPassword = !this.showPassword;
    }

    get passwordToggleLabel(): string {
        return this.showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish";
    }

    private sanitizeNumber(value: any): string {
        let raw = String(value ?? '').replace(/[^\d-]/g, '');
        raw = this.allowNegative ? raw.replace(/(?!^)-/g, '') : raw.replace(/-/g, '');
        raw = raw.replace(/^(-?)0+(?=\d)/, '$1');
        return raw;
    }

    private sanitizeDecimalExpression(value: any): string {
        if (value === null || value === undefined || value === '') return '';
        let raw = String(value).replace(/[,\s]/g, '').replace(/[^\d.+-]/g, '');
        const negative = this.allowNegative && raw.startsWith('-');
        raw = raw.replace(/^[+-]+/, '');
        const operatorIndex = this.allowMathExpression ? raw.search(/[+-]/) : -1;
        const part = (value: string) => {
            const [whole, ...fraction] = value.replace(/[^\d.]/g, '').split('.');
            return fraction.length ? `${whole || '0'}.${fraction.join('').slice(0, this.decimalPlaces)}` : whole;
        };
        const left = operatorIndex < 0 ? raw : raw.slice(0, operatorIndex);
        const right = operatorIndex < 0 ? '' : raw.slice(operatorIndex + 1);
        return `${negative ? '-' : ''}${part(left)}${operatorIndex < 0 ? '' : raw[operatorIndex] + part(right)}`;
    }

    private formatNumberValue(value: any): string {
        if (value === null || value === undefined || value === '') return '';
        return this.formatNumberRaw(this.sanitizeNumber(value));
    }

    private formatNumberRaw(raw: string): string {
        if (!raw || raw === '-') return raw;

        const isNegative = raw.startsWith('-');
        const digits = raw.replace(/[^\d]/g, '');
        const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `${isNegative ? '-' : ''}${formatted}`;
    }

    private sanitizeNumberExpression(value: any): string {
        let raw = String(value ?? '').replace(/[^\d+\-\s.]/g, '');
        raw = raw.replace(/[.\s]/g, '');
        const isNegative = this.allowNegative && raw.startsWith('-');
        raw = raw.replace(/^[+-]+/, '');

        const operatorMatch = raw.match(/[+-]/);
        if (!operatorMatch) return `${isNegative ? '-' : ''}${raw}`;

        const operatorIndex = operatorMatch.index ?? -1;
        const left = raw.slice(0, operatorIndex).replace(/[+-]/g, '').trim();
        const operator = operatorMatch[0];
        const right = raw
            .slice(operatorIndex + 1)
            .replace(/[+-]/g, '')
            .trim();

        return `${isNegative ? '-' : ''}${left}${operator}${right}`;
    }

    private formatNumberExpressionValue(value: any): string {
        if (value === null || value === undefined || value === '') return '';
        return this.formatNumberExpression(this.sanitizeNumberExpression(value));
    }

    private formatNumberExpression(raw: string): string {
        if (!raw) return '';

        const isNegative = raw.startsWith('-');
        const expression = isNegative ? raw.slice(1) : raw;
        const operatorIndex = expression.search(/[+-]/);
        if (operatorIndex === -1) {
            const value = this.formatNumberExpressionPart(expression);
            return isNegative ? `-${value}` : value;
        }

        const left = expression.slice(0, operatorIndex);
        const operator = expression[operatorIndex];
        const right = expression.slice(operatorIndex + 1);

        return `${isNegative ? '-' : ''}${this.formatNumberExpressionPart(left)}${operator}${this.formatNumberExpressionPart(right)}`;
    }

    private formatNumberExpressionPart(part: string): string {
        const digits = part.replace(/[^\d]/g, '');
        if (!digits) return '';

        return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    private evaluateNumberExpression(value: any): number | null {
        const raw = String(value ?? '')
            .trim()
            .replace(/[.\s]/g, '');
        const numberPattern = this.allowNegative ? /^-?\d+$/ : /^\d+$/;
        const expressionPattern = this.allowNegative ? /^(-?\d+)([+-])(\d+)$/ : /^(\d+)([+-])(\d+)$/;
        if (!raw) return null;
        if (numberPattern.test(raw)) return Number(raw);

        const match = raw.match(expressionPattern);
        if (!match) return null;

        const left = Number(match[1]);
        const right = Number(match[3]);
        const result = match[2] === '+' ? left + right : left - right;
        return Number.isFinite(result) && (this.allowNegative || result >= 0) ? result : null;
    }
}
