import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputComponent } from '../../../shared/components/input/input.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

export type InventoryFormModel = {
    _id?: string;
    productId?: string;
    productName: string;
    productPrice: number;
    name?: string;
    price?: number;
    currency?: 'UZS' | 'USD';
    amount: number;
};

@Component({
    selector: 'inventory-form',
    standalone: true,
    templateUrl: './inventory-form.component.html',
    styleUrls: ['./inventory-form.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputComponent, MoneyPipe]
})
export class InventoryFormComponent implements OnInit {
    @Input() model: Partial<InventoryFormModel> = {};
    @Input() loading = false;

    onClose!: () => void;
    onSubmitted!: (payload: InventoryFormModel) => void;

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            amount: [null, [Validators.required, this.amountExpressionValidator.bind(this)]]
        });
    }

    ngOnInit() {
        this.form.patchValue(
            {
                amount: this.model.amount ?? 0
            },
            { emitEvent: false }
        );
    }

    submitForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const raw = this.form.getRawValue();
        const amount = this.parseAmountExpression(raw.amount);

        this.onSubmitted?.({
            _id: this.model._id,
            productId: this.model.productId ?? this.model._id,
            productName: this.productName,
            productPrice: this.productPrice,
            amount: amount ?? 0
        });
    }

    closeModal() {
        this.onClose?.();
    }

    get amountPlaceholder(): string {
        return 'Maxsulot sonini kiriting';
    }

    get productName(): string {
        return this.model.name ?? this.model.productName ?? '-';
    }

    get productPrice(): number {
        return Number(this.model.price ?? this.model.productPrice ?? 0);
    }

    get productCurrency(): 'UZS' | 'USD' {
        return this.model.currency === 'USD' ? 'USD' : 'UZS';
    }

    private amountExpressionValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value === null || value === undefined || value === '') return null;

        const parsed = this.parseAmountExpression(value);
        if (parsed === null) return { amountExpression: true };
        if (parsed < 0) return { amountNegative: true };

        return null;
    }

    private parseAmountExpression(value: unknown): number | null {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : null;
        }

        const raw = String(value ?? '')
            .trim()
            .replace(/[.\s]/g, '');

        if (!raw) return null;
        if (!/^\d+(?:[+-]\d+)?$/.test(raw)) return null;

        const operatorIndex = raw.search(/[+-]/);
        if (operatorIndex === -1) return Number(raw);

        const left = Number(raw.slice(0, operatorIndex));
        const right = Number(raw.slice(operatorIndex + 1));
        if (!Number.isFinite(left) || !Number.isFinite(right)) return null;

        return raw[operatorIndex] === '+' ? left + right : left - right;
    }
}
