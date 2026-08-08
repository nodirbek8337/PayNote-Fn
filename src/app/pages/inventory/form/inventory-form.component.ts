import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputComponent } from '../../../shared/components/input/input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { ProductsService } from '../../service/products.service';

export type InventoryFormModel = {
    _id?: string;
    productId: string;
    amount: number;
};

@Component({
    selector: 'inventory-form',
    standalone: true,
    templateUrl: './inventory-form.component.html',
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputComponent, SelectComponent]
})
export class InventoryFormComponent implements OnInit {
    @Input() model: Partial<InventoryFormModel & { productName?: string }> = {};
    @Input() loading = false;

    onClose!: () => void;
    onSubmitted!: (payload: InventoryFormModel) => void;

    private productsService = inject(ProductsService);
    productOptions: { label: string; value: string }[] = [];
    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            productId: [null, [Validators.required]],
            amount: [0, [Validators.required, Validators.min(0)]]
        });
    }

    ngOnInit() {
        this.loadProducts();
        this.form.patchValue(
            {
                productId: this.model.productId ?? null,
                amount: this.model.amount ?? 0
            },
            { emitEvent: false }
        );

        if (this.model._id) {
            this.form.get('productId')?.disable({ emitEvent: false });
        }
    }

    loadProducts() {
        this.productsService.getAll({ page: 1, per_page: 1000 }).subscribe({
            next: (res: any) => {
                this.productOptions = (res?.data || []).map((product: any) => ({
                    label: product.name,
                    value: product._id
                }));
            },
            error: () => {
                this.productOptions = [];
            }
        });
    }

    submitForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const raw = this.form.getRawValue();
        this.onSubmitted?.({
            _id: this.model._id,
            productId: raw.productId,
            amount: Number(raw.amount ?? 0)
        });
    }

    closeModal() {
        this.onClose?.();
    }
}
