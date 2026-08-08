import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { CustomDateRendererComponent } from '../../shared/components/badge/custom-date-renderer.component';
import { ProductsService } from '../service/products.service';
import { ProductsFormComponent } from './form/products-form.component';
import { MoneyPipe } from '../../shared/pipes/money.pipe';

@Component({
    selector: 'products',
    standalone: true,
    imports: [PrimeDatatableComponent, NgIf],
    templateUrl: './products.component.html',
    providers: [MoneyPipe]
})
export class ProductsComponent {
    _defaultService = inject(ProductsService);
    private _moneyPipe = inject(MoneyPipe);

    FormComponent = ProductsFormComponent;

    columnDefs = [
        { field: 'name', header: 'Mahsulot nomi', widthClass: 'w-35p', sortable: false, placeholder: 'Mahsulot nomi' },
        {
            field: 'price',
            header: 'Narxi',
            widthClass: 'w-20p',
            sortable: false,
            searchable: false,
            cellRendererFn: (row: any, field: string) => `<span>${this._moneyPipe.transform(row[field], 'UZS')}</span>`
        },
        {
            field: 'createdAt',
            header: 'Yaratilgan vaqt',
            filterType: 'date-range',
            widthClass: 'w-20p',
            sortable: false,
            cellRendererComponent: CustomDateRendererComponent
        },
        {
            field: 'updatedAt',
            header: 'Yangilangan vaqt',
            filterType: 'date-range',
            widthClass: 'w-20p',
            sortable: false,
            cellRendererComponent: CustomDateRendererComponent
        }
    ];
}
