import { Component, forwardRef, Input, OnInit, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgIf, NgClass, InputTextModule, PasswordModule, FormsModule],
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

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    const validator = this.control?.validator?.({} as any);
    this.required ||= !!validator?.['required'];
  }

  writeValue(val: any): void { this.value = val; }
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
}
