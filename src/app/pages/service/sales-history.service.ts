import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable({ providedIn: 'root' })
export class SalesHistoryService extends DefaultService {
    override formName = 'sales-history';

    override getUrl(): string {
        return 'api/sales';
    }
}
