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
    this.value = this.type === 'number' ? this.formatNumberValue(val) : val;
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

    const raw = this.sanitizeNumber(value);
    this.value = this.formatNumberRaw(raw);
    this.onChange(raw === '' || raw === '-' ? null : Number(raw));
  }

  get nativeInputType(): string {
    return this.type === 'number' ? 'text' : this.type;
  }

  get inputMode(): string | null {
    return this.type === 'number' ? 'numeric' : null;
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
    raw = raw.replace(/(?!^)-/g, '');
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
}
