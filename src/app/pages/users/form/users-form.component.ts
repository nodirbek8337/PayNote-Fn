import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';

import { ButtonDirective } from 'primeng/button';

import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { SwitchToggleComponent } from '../../../shared/components/switch-toggle/switch-toggle.component';

export type UserFormModel = {
    _id?: string;
    username: string;
    role: 'admin' | 'user' | 'manager' | string;
    telegramUsername?: string | null;
    telegramNotifications?: Array<'FRIDGE' | 'HOTEL'>;
    isActive?: boolean;
    password?: string;
};

@Component({
    selector: 'users-form',
    standalone: true,
    templateUrl: './users-form.component.html',
    styleUrls: ['./users-form.component.scss'],
    imports: [ReactiveFormsModule, ButtonDirective, InputComponent, SelectComponent, SwitchToggleComponent]
})
export class UsersFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);

    @Input() model: Partial<UserFormModel> = {};
    @Input() loading = false;

    onClose!: () => void;
    onSubmitted!: (payload: UserFormModel) => void;

    form!: FormGroup;
    isEdit = false;
    changePassword = false;

    roleOptions = [
        { label: 'Boshliq', value: 'admin' },
        { label: 'Muzlatgich ishchisi', value: 'user' },
        { label: 'Mehmonxona manageri', value: 'manager' }
    ];
    telegramNotificationOptions = [
        { label: 'Muzlatgich habarlari', value: 'FRIDGE' },
        { label: 'Mehmonxona habarlari', value: 'HOTEL' }
    ];

    ngOnInit() {
        this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['loading'] && this.form) {
            if (this.loading) this.form.disable({ emitEvent: false });
            else this.form.enable({ emitEvent: false });
        }
        if (changes['model'] && !changes['model'].firstChange && this.form) {
            this.patchForm();
        }
    }

    private buildForm() {
        this.isEdit = !!this.model?._id;

        this.form = this.fb.group({
            username: [this.model.username ?? '', [Validators.required, Validators.maxLength(120)]],
            role: [this.model.role ?? null, [Validators.required]],
            isActive: [this.model.isActive ?? true],
            password: [''],
            telegramUsername: [this.model.telegramUsername ?? ''],
            telegramNotifications: [this.model.telegramNotifications ?? []]
        });

        this.setPasswordValidators();
    }

    private patchForm() {
        this.isEdit = !!this.model?._id;
        this.changePassword = false;

        this.form.reset(
            {
                username: this.model.username ?? '',
                role: this.model.role ?? null,
                isActive: this.model.isActive ?? true,
                password: '',
                telegramUsername: this.model.telegramUsername ?? '',
                telegramNotifications: this.model.telegramNotifications ?? []
            },
            { emitEvent: false }
        );

        const pwdCtrl = this.form.get('password')!;
        this.setPasswordValidators(pwdCtrl);
    }

    private setPasswordValidators(control = this.form.get('password')!) {
        const validators = this.isEdit && !this.changePassword ? [this.passwordRulesValidator()] : [Validators.required, this.passwordRulesValidator()];

        control.clearValidators();
        control.setValidators(validators);
        control.updateValueAndValidity({ emitEvent: false });
    }

    togglePasswordChange(): void {
        this.changePassword = !this.changePassword;
        this.form.get('password')!.reset('');
        this.setPasswordValidators();
    }

    private passwordRulesValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = String(control.value ?? '');
            if (!value) return null;

            const errors: ValidationErrors = {};

            if (value.length < 6) errors['passwordMinLength'] = true;
            if (!/[A-Z]/.test(value)) errors['passwordUppercase'] = true;
            if (!/[a-z]/.test(value)) errors['passwordLowercase'] = true;
            if (!/\d/.test(value)) errors['passwordNumber'] = true;

            return Object.keys(errors).length ? errors : null;
        };
    }

    submitForm() {
        if (this.loading) return;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const raw = this.form.value;
        const password = raw.password ?? '';

        const payload: UserFormModel = {
            _id: this.model._id,
            username: (raw.username ?? '').trim(),
            role: raw.role,
            isActive: !!raw.isActive,
            ...(!this.isEdit || this.form.get('telegramUsername')!.dirty ? { telegramUsername: String(raw.telegramUsername ?? '').trim() } : {}),
            ...(!this.isEdit || this.form.get('telegramNotifications')!.dirty ? { telegramNotifications: Array.isArray(raw.telegramNotifications) ? raw.telegramNotifications : [] } : {}),
            ...((!this.isEdit || this.changePassword) && password ? { password } : {})
        };

        this.onSubmitted?.(payload);
    }

    closeModal() {
        this.onClose?.();
    }

    get passwordLabel() {
        return this.isEdit ? 'Yangi parol kiriting' : 'Parol kiriting';
    }
}
