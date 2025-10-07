import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-switch-toggle',
  standalone: true,
  imports: [CommonModule, InputSwitchModule, FormsModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SwitchToggleComponent), multi: true }
  ],
  templateUrl: './switch-toggle.component.html',
  styleUrls: ['./switch-toggle.component.scss']
})
export class SwitchToggleComponent implements ControlValueAccessor {
  @Input() label = 'Faol holat';
  @Input() trueLabel = 'Faol';
  @Input() falseLabel = 'Nofaol';
  @Input() showStateText = true;
  @Input() disabled = false;

  value = false;
  isDisabled = false;

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: boolean): void { this.value = !!v; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled = disabled; }

  onToggle(v: boolean) {
    if (this.disabled || this.isDisabled) return;
    this.value = !!v;
    this.onChange(this.value);
    this.onTouched();
  }

  get effectiveDisabled() { return this.disabled || this.isDisabled; }
}
