import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { InventoryItemsService } from '../service/inventory-items.service';
import { InventoryFormComponent } from './form/inventory-form.component';
import { CustomDateRendererComponent } from '../../shared/components/badge/custom-date-renderer.component';
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
        { field: 'productName', header: 'Mahsulot', widthClass: 'w-30p', sortable: false, placeholder: 'Mahsulot nomi' },
        {
            field: 'productPrice',
            header: 'Narxi',
            widthClass: 'w-20p',
            sortable: false,
            searchable: false,
            cellRendererFn: (row: any, field: string) => `<span>${this._moneyPipe.transform(row[field], 'UZS')}</span>`
        },
        { field: 'amount', header: 'Soni', widthClass: 'w-15p', sortable: false, searchable: false },
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
