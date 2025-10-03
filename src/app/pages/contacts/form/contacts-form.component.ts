import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputComponent } from "../../../shared/components/input/input.component";
import { PhoneInputComponent } from '../../../shared/components/phone-input/phone-input.component';
import { MoneyInputComponent } from '../../../shared/components/money-input/money-input.component';

export type ContactFormModel = {
  _id?: string;
  name: string;
  phone?: string;
  amount: number;
  amountCurrency?: 'UZS' | 'USD';
  note?: string;
};

@Component({
  selector: 'contacts-form',
  standalone: true,
  templateUrl: './contacts-form.component.html',
  styleUrls: ['./contacts-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputComponent,
    PhoneInputComponent,
    MoneyInputComponent
  ],
})
export class ContactsFormComponent implements OnInit {
  @Input() model: Partial<ContactFormModel> = {};
  @Input() loading = false;

  onClose!: () => void;
  onSubmitted!: (payload: ContactFormModel) => void;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      phone: ['', [Validators.pattern(/^\d{12}$/)]],
      amount: [null],
      note: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    if (this.model) {
      const amountForControl =
        this.model.amount != null
          ? {
            amount: this.model.amount,
            currency: (this.model.amountCurrency || 'UZS') as 'UZS' | 'USD'
          }
          : null;

      this.form.patchValue(
        {
          name: this.model.name ?? '',
          phone: this.model.phone ?? '',
          amount: amountForControl,
          note: this.model.note ?? ''
        },
        { emitEvent: false }
      );
    }
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const amountCtrlValue = this.form.value.amount as
      | { amount: number | null; currency: 'UZS' | 'USD' }
      | number
      | null;

    let amount = 0;
    let amountCurrency: 'UZS' | 'USD' = 'UZS';

    if (amountCtrlValue && typeof amountCtrlValue === 'object') {
      amount = Number(amountCtrlValue.amount ?? 0);
      amountCurrency = (amountCtrlValue.currency || 'UZS') as 'UZS' | 'USD';
    } else {
      amount = Number(amountCtrlValue ?? 0);
      amountCurrency = 'UZS';
    }

    const payload: ContactFormModel = {
      _id: this.model._id,
      name: this.form.value.name,
      phone: this.form.value.phone || undefined,
      amount,
      amountCurrency,
      note: this.form.value.note || undefined
    };

    this.onSubmitted?.(payload);
  }

  closeModal() {
    this.onClose?.();
  }
}
