import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable({ providedIn: 'root' })
export class EmptyRoomsService extends DefaultService {
    override formName = 'empty-rooms';

    override getUrl(): string { return 'api/hotel/empty-rooms'; }

    deleteWithReason(id: string, note: string) {
        return this._http.delete<any>(`${this.getTableUrl()}/${id}`, {
            body: { confirmation: 'DELETE', note }
        });
    }
}
