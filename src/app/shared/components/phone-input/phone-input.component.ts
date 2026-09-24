import { Component, forwardRef, Input, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { digits12, formatUzPhoneDash } from '../../utils/phone.util';
import { ControlErrorComponent } from '../control-error/control-error.component';
import { PHONE_ERROR_MESSAGES } from '../../constants/control-error-messages';
import { NoAutofillDirective } from '../../directives/no-autofill.directive';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [NgClass, InputTextModule, FormsModule, ControlErrorComponent, NoAutofillDirective],
  templateUrl: './phone-input.component.html',
  styleUrls: ['../input/input.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PhoneInputComponent), multi: true }]
})
export class PhoneInputComponent implements ControlValueAccessor {
  constructor(@Optional() private controlContainer: ControlContainer) {}

  @Input() placeholder = '998-__-___-__-__';
  @Input() formControlName!: string;
  @Input() required = false;

  rawValue = '';
  displayValue = '998-';
  isDisabled = false;
  readonly errorMessages = PHONE_ERROR_MESSAGES;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(val: any): void {
    const d = digits12(val);
    this.rawValue = d;
    this.displayValue = d ? formatUzPhoneDash(d) : '998-';
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled = disabled; }

  onInput(event: any) {
    let d = digits12(event.target.value);
    if (!d.startsWith('998')) d = ('998' + d).slice(0, 12);
    this.rawValue = d;
    this.displayValue = formatUzPhoneDash(d);
    this.onChange(this.rawValue);
    this.onTouched();
  }

  get control() { return this.controlContainer?.control?.get?.(this.formControlName); }
  shouldShowErrors(): boolean {
    const c = this.control;
    return !!c && this.required && c.invalid && (c.dirty || c.touched);
  }

}
