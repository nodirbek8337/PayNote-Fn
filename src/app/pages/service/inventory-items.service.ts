import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InventoryItemsService extends DefaultService {
    override formName = 'inventory-items';

    override getUrl(): string {
        return 'api/products';
    }

    override update(form: any, id: any) {
        return this._http
            .put(`${this.getTableUrl()}/${id}/amount`, {
                amount: Number(form?.amount ?? 0),
                requestFrom: 'inventory'
            })
            .pipe(tap(() => this.loadDataTable()));
    }
}
