import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { InventoryItemsService } from '../service/inventory-items.service';
import { InventoryFormComponent } from './form/inventory-form.component';
import { MoneyPipe } from '../../shared/pipes/money.pipe';

@Component({
    selector: 'inventory',
    standalone: true,
    imports: [PrimeDatatableComponent, NgIf],
    templateUrl: './inventory.component.html',
    providers: [MoneyPipe]
})
export class InventoryComponent {
    _defaultService = inject(InventoryItemsService);
    private _moneyPipe = inject(MoneyPipe);

    FormComponent = InventoryFormComponent;

    columnDefs = [
        {
            field: 'name',
            header: 'Maxsulot nomi',
            widthClass: 'w-30p',
            sortable: false,
            placeholder: 'Maxsulot nomini kiriting',
            cellRendererFn: (row: any) => `<span>${row.name ?? row.productName ?? '-'}</span>`
        },
        {
            field: 'price',
            header: 'Maxsulot narxi',
            widthClass: 'w-20p',
            sortable: false,
            searchable: false,
            cellRendererFn: (row: any) => `<span>${this._moneyPipe.transform(row.price ?? row.productPrice, row.currency === 'USD' ? 'USD' : 'UZS')}</span>`
        },
        { field: 'currency', header: 'Valuta', widthClass: 'w-10p', sortable: false, searchable: false, cellRendererFn: (row: any) => `<span class="currency-label">${row.currency === 'USD' ? 'USD' : 'UZS'}</span>` },
        {
            field: 'amount',
            header: 'Maxsulot soni',
            widthClass: 'w-15p',
            sortable: false,
            searchable: false,
            cellRendererFn: (row: any) => `<span>${row.amount ?? 0}</span>`
        }
    ];
}
