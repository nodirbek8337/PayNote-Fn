import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
            amount: [null, [Validators.required, Validators.min(0)]]
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

        this.onSubmitted?.({
            _id: this.model._id,
            productId: this.model.productId ?? this.model._id,
            productName: this.productName,
            productPrice: this.productPrice,
            amount: Number(raw.amount ?? 0)
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
}
