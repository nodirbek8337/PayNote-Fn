import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable({
    providedIn: 'root'
})
export class ProductsService extends DefaultService {
    override formName = 'products';

    override getUrl(): string {
        return 'api/products';
    }
}
