import { Component, forwardRef, Input, OnInit, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ControlErrorComponent } from '../control-error/control-error.component';
import { INPUT_ERROR_MESSAGES } from '../../constants/control-error-messages';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgIf, NgClass, InputTextModule, FormsModule, ControlErrorComponent],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  constructor(@Optional() private controlContainer: ControlContainer) {}

  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() formControlName!: string;
  @Input() required = false;
  @Input() allowMathExpression = false;
  @Input() allowNegative = false;

  value: any = '';
  isDisabled = false;
  showPassword = false;
  readonly errorMessages = INPUT_ERROR_MESSAGES;

  onChange = (_: any) => {};
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

    this.value = this.allowMathExpression
      ? this.formatNumberExpressionValue(val)
      : this.formatNumberValue(val);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled = disabled; }

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

  handleBlur(): void {
    if (this.type === 'number' && this.allowMathExpression) {
      const result = this.evaluateNumberExpression(this.value);

      if (result !== null && result >= 0) {
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
    return this.type === 'number' ? (this.allowMathExpression ? 'text' : 'numeric') : null;
  }

  togglePasswordVisibility(): void {
    if (this.isDisabled) return;
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
    raw = raw.replace(/[.]/g, ' ');
    raw = raw.replace(/\s+/g, ' ');
    raw = raw.replace(/^[+-]+/, '');

    const operatorMatch = raw.match(/[+-]/);
    if (!operatorMatch) return raw.trim();

    const operatorIndex = operatorMatch.index ?? -1;
    const left = raw.slice(0, operatorIndex).replace(/[+-]/g, '').trim();
    const operator = operatorMatch[0];
    const right = raw.slice(operatorIndex + 1).replace(/[+-]/g, '').trim();

    return `${left}${operator}${right}`;
  }

  private formatNumberExpressionValue(value: any): string {
    if (value === null || value === undefined || value === '') return '';
    return this.formatNumberExpression(this.sanitizeNumberExpression(value));
  }

  private formatNumberExpression(raw: string): string {
    if (!raw) return '';

    const operatorIndex = raw.search(/[+-]/);
    if (operatorIndex === -1) return this.formatNumberExpressionPart(raw);

    const left = raw.slice(0, operatorIndex);
    const operator = raw[operatorIndex];
    const right = raw.slice(operatorIndex + 1);

    return `${this.formatNumberExpressionPart(left)}${operator}${this.formatNumberExpressionPart(right)}`;
  }

  private formatNumberExpressionPart(part: string): string {
    const digits = part.replace(/[^\d]/g, '');
    if (!digits) return '';

    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private evaluateNumberExpression(value: any): number | null {
    const raw = String(value ?? '').trim().replace(/[.\s]/g, '');
    if (!raw || !/^\d+(?:[+-]\d+)?$/.test(raw)) return null;

    const operatorIndex = raw.search(/[+-]/);
    if (operatorIndex === -1) return Number(raw);

    const left = Number(raw.slice(0, operatorIndex));
    const right = Number(raw.slice(operatorIndex + 1));
    if (!Number.isFinite(left) || !Number.isFinite(right)) return null;

    return raw[operatorIndex] === '+' ? left + right : left - right;
  }
}
