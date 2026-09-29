import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { SwitchToggleComponent } from '../../../shared/components/switch-toggle/switch-toggle.component';
import { TimeInputComponent } from '../../../shared/components/time-input/time-input.component';

type ReportType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type HotelReportFormModel = {
    _id?: string;
    name: string;
    type: ReportType;
    sendTime: string;
    weekDay?: number | null;
    isActive?: boolean;
};

@Component({
    selector: 'hotel-report-form',
    standalone: true,
    templateUrl: './hotel-report-form.component.html',
    styleUrl: './hotel-report-form.component.scss',
    imports: [ReactiveFormsModule, ButtonDirective, InputComponent, SelectComponent, SwitchToggleComponent, TimeInputComponent]
})
export class HotelReportFormComponent implements OnInit, OnChanges {
    private readonly fb = inject(FormBuilder);

    @Input() model: Partial<HotelReportFormModel> = {};
    @Input() loading = false;
    onClose!: () => void;
    onSubmitted!: (payload: HotelReportFormModel) => void;
    form!: FormGroup;

    readonly typeOptions = [
        { label: 'Kunlik', value: 'DAILY' }, { label: 'Haftalik', value: 'WEEKLY' }, { label: 'Oylik', value: 'MONTHLY' }
    ];
    readonly weekDays = [
        { label: 'Dushanba', value: 1 }, { label: 'Seshanba', value: 2 }, { label: 'Chorshanba', value: 3 },
        { label: 'Payshanba', value: 4 }, { label: 'Juma', value: 5 }, { label: 'Shanba', value: 6 }, { label: 'Yakshanba', value: 0 }
    ];

    ngOnInit(): void { this.buildForm(); }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['loading'] && this.form) this.loading ? this.form.disable({ emitEvent: false }) : this.form.enable({ emitEvent: false });
        if (changes['model'] && !changes['model'].firstChange && this.form) this.patchForm();
    }

    get type(): ReportType { return this.form?.get('type')?.value ?? 'DAILY'; }

    submitForm(): void {
        if (this.loading) return;
        this.updateTypeValidators();
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        this.onSubmitted?.({
            _id: this.model._id,
            name: String(value.name ?? '').trim(),
            type: value.type,
            sendTime: value.sendTime,
            weekDay: value.type === 'WEEKLY' ? Number(value.weekDay) : null,
            isActive: !!value.isActive
        });
    }

    closeModal(): void { this.onClose?.(); }

    private buildForm(): void {
        this.form = this.fb.group({
            name: [this.model.name ?? '', [Validators.required, Validators.maxLength(100)]],
            type: [this.normalizeType(this.model.type), Validators.required],
            sendTime: [this.model.sendTime ?? '19:00', Validators.required],
            weekDay: [this.model.weekDay ?? 1],
            isActive: [this.model.isActive ?? true]
        });
        this.updateTypeValidators();
        this.form.get('type')!.valueChanges.subscribe(() => this.updateTypeValidators());
    }

    private patchForm(): void {
        this.form.reset({
            name: this.model.name ?? '', type: this.normalizeType(this.model.type), sendTime: this.model.sendTime ?? '19:00',
            weekDay: this.model.weekDay ?? 1, isActive: this.model.isActive ?? true
        }, { emitEvent: false });
        this.updateTypeValidators();
    }

    private updateTypeValidators(): void {
        if (!this.form) return;
        const weekDay = this.form.get('weekDay')!;
        weekDay.setValidators(this.type === 'WEEKLY' ? [Validators.required, Validators.min(0), Validators.max(6)] : []);
        weekDay.updateValueAndValidity({ emitEvent: false });
    }

    private normalizeType(type: unknown): ReportType {
        return type === 'WEEKLY' || type === 'MONTHLY' ? type : 'DAILY';
    }
}
