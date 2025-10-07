import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  isActive?: boolean;
  password?: string;
};

@Component({
  selector: 'users-form',
  standalone: true,
  templateUrl: './users-form.component.html',
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

  roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'User',  value: 'user'  }
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
      role:     [this.model.role ?? 'user', [Validators.required]],
      isActive: [this.model.isActive ?? true],
      password: ['']
    });

    if (!this.isEdit) {
      this.form.get('password')!.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')!.updateValueAndValidity({ emitEvent: false });
    }
  }

  private patchForm() {
    this.isEdit = !!this.model?._id;

    this.form.patchValue({
      username: this.model.username ?? '',
      role: this.model.role ?? 'user',
      isActive: this.model.isActive ?? true,
      password: ''
    }, { emitEvent: false });

    const pwdCtrl = this.form.get('password')!;
    pwdCtrl.clearValidators();
    if (!this.isEdit) {
      pwdCtrl.setValidators([Validators.required, Validators.minLength(6)]);
    }
    pwdCtrl.updateValueAndValidity({ emitEvent: false });
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const password = (raw.password ?? '').trim();

    const payload: UserFormModel = {
      _id: this.model._id,
      username: (raw.username ?? '').trim(),
      role: raw.role,
      isActive: !!raw.isActive,
      ...(password ? { password } : {})
    };

    this.onSubmitted?.(payload);
  }

  closeModal() {
    this.onClose?.();
  }

  get passwordLabel() {
    return this.isEdit ? 'Yangi parol (ixtiyoriy)' : 'Parol';
    }
}
