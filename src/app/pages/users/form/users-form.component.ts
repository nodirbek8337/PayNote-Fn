import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';

import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { SwitchToggleComponent } from '../../../shared/components/switch-toggle/switch-toggle.component';

export type UserFormModel = {
  _id?: string;
  username: string;
  role: 'admin' | 'user' | string;
  telegramUsername?: string | null;
  isActive?: boolean;
  password?: string;
};

@Component({
  selector: 'users-form',
  standalone: true,
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputSwitchModule,
    InputComponent,
    SelectComponent,
    SwitchToggleComponent
  ],
})
export class UsersFormComponent implements OnInit, OnChanges {
  @Input() model: Partial<UserFormModel> = {};
  @Input() loading = false;

  onClose!: () => void;
  onSubmitted!: (payload: UserFormModel) => void;

  form!: FormGroup;
  isEdit = false;
  changePassword = false;

  roleOptions = [
    { label: 'Boshliq', value: 'admin' },
    { label: 'Ishchi',  value: 'user'  }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading'] && this.form) {
      this.loading ? this.form.disable({ emitEvent: false }) : this.form.enable({ emitEvent: false });
    }
    if (changes['model'] && !changes['model'].firstChange && this.form) {
      this.patchForm();
    }
  }

  private buildForm() {
    this.isEdit = !!this.model?._id;

    this.form = this.fb.group({
      username: [this.model.username ?? '', [Validators.required, Validators.maxLength(120)]],
      role:     [this.model.role ?? null, [Validators.required]],
      isActive: [this.model.isActive ?? true],
      password: [''],
      telegramUsername: [this.model.telegramUsername ?? '']
    });

    this.setPasswordValidators();
  }

  private patchForm() {
    this.isEdit = !!this.model?._id;
    this.changePassword = false;

    this.form.reset({
      username: this.model.username ?? '',
      role: this.model.role ?? null,
      isActive: this.model.isActive ?? true,
      password: '',
      telegramUsername: this.model.telegramUsername ?? ''
    }, { emitEvent: false });

    const pwdCtrl = this.form.get('password')!;
    this.setPasswordValidators(pwdCtrl);
  }

  private setPasswordValidators(control = this.form.get('password')!) {
    const validators = this.isEdit && !this.changePassword
      ? [this.passwordRulesValidator()]
      : [Validators.required, this.passwordRulesValidator()];

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
      ...(!this.isEdit || this.form.get('telegramUsername')!.dirty
        ? { telegramUsername: String(raw.telegramUsername ?? '').trim() } : {}),
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
