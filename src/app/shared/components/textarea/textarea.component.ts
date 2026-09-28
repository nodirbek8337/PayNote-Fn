import { Component, forwardRef, Input, inject } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ControlErrorComponent } from '../control-error/control-error.component';
import { NoAutofillDirective } from '../../directives/no-autofill.directive';
import { INPUT_ERROR_MESSAGES } from '../../constants/control-error-messages';

let nextTextareaId = 0;

@Component({
    selector: 'app-textarea',
    standalone: true,
    imports: [FormsModule, TextareaModule, ControlErrorComponent, NoAutofillDirective],
    templateUrl: './textarea.component.html',
    styleUrl: './textarea.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaComponent),
            multi: true
        }
    ]
})
export class TextareaComponent implements ControlValueAccessor {
    private controlContainer = inject(ControlContainer, { optional: true });

    @Input() placeholder = '';
    @Input() formControlName!: string;
    @Input() rows = 3;
    @Input() maxlength?: number;
    @Input() disabled = false;
    @Input() autocomplete = 'off';
    @Input() inputName = '';
    @Input() inputId = `paynote-textarea-${++nextTextareaId}`;

    value = '';
    isDisabled = false;
    readonly errorMessages = INPUT_ERROR_MESSAGES;

    onChange = (_value: string) => {};
    onTouched = () => {};

    get control() {
        return this.controlContainer?.control?.get?.(this.formControlName);
    }

    writeValue(value: unknown): void {
        this.value = String(value ?? '');
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.isDisabled = disabled;
    }

    updateValue(value: string): void {
        this.value = value;
        this.onChange(value);
    }

    shouldShowErrors(): boolean {
        const control = this.control;
        return !!control && control.invalid && (control.dirty || control.touched);
    }
}
