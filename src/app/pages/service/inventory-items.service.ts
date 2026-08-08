import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable({
    providedIn: 'root'
})
export class InventoryItemsService extends DefaultService {
    override formName = 'inventory-items';

    override getUrl(): string {
        return 'api/inventory-items';
    }
}
