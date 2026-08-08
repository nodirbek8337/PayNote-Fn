import { Component, forwardRef, Input, OnInit, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ControlErrorComponent } from '../control-error/control-error.component';
import { SELECT_ERROR_MESSAGES } from '../../constants/control-error-messages';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, SelectModule, MultiSelectModule, ControlErrorComponent],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }]
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  constructor(@Optional() private controlContainer: ControlContainer) {}

  @Input() formControlName!: string;

  @Input() options: any[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string | null = 'value';

  @Input() placeholder: string = '';
  @Input() showClear: boolean = true;
  @Input() filter: boolean = false;

  @Input() multiple: boolean = false;

  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() dataKey?: string;

  value: any = null;
  isDisabled = false;
  readonly errorMessages = SELECT_ERROR_MESSAGES;

  private onChangeCb: (v: any) => void = () => {};
  private onTouchedCb: () => void = () => {};

  ngOnInit(): void {
    const validator = this.control?.validator?.({} as any);
    this.required ||= !!validator?.['required'];
  }

  writeValue(val: any): void { this.value = val; }
  registerOnChange(fn: any): void { this.onChangeCb = fn; }
  registerOnTouched(fn: any): void { this.onTouchedCb = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled = disabled; }

  get control() {
    return this.controlContainer?.control?.get?.(this.formControlName);
  }

  shouldShowErrors(): boolean {
    const c = this.control;
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  onModelChange(v: any) {
    this.value = v;
    this.onChangeCb(v);
  }

  onBlur() {
    this.onTouchedCb();
  }
}
