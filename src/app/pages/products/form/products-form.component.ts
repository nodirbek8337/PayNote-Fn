import { Component, Input, OnInit, inject } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputComponent } from '../../../shared/components/input/input.component';
import { MoneyInputComponent } from '../../../shared/components/money-input/money-input.component';

export type ProductFormModel = {
    _id?: string;
    name: string;
    price: number;
    currency: 'UZS' | 'USD';
};

@Component({
    selector: 'products-form',
    standalone: true,
    templateUrl: './products-form.component.html',
    styleUrls: ['./products-form.component.scss'],
    imports: [ReactiveFormsModule, ButtonDirective, InputComponent, MoneyInputComponent]
})
export class ProductsFormComponent implements OnInit {
    private fb = inject(FormBuilder);

    @Input() model: Partial<ProductFormModel> = {};
    @Input() loading = false;

    onClose!: () => void;
    onSubmitted!: (payload: ProductFormModel) => void;

    form: FormGroup;

    constructor() {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(120)]],
            price: [null, [Validators.required, Validators.min(0)]],
            currency: ['UZS', Validators.required]
        });
    }

    ngOnInit() {
        this.form.patchValue(
            {
                name: this.model.name ?? '',
                price: this.model.price ?? null,
                currency: this.model.currency === 'USD' ? 'USD' : 'UZS'
            },
            { emitEvent: false }
        );
    }

    submitForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.onSubmitted?.({
            _id: this.model._id,
            name: this.form.value.name,
            price: Number(this.form.value.price ?? 0),
            currency: this.form.value.currency === 'USD' ? 'USD' : 'UZS'
        });
    }

    closeModal() {
        this.onClose?.();
    }
}
