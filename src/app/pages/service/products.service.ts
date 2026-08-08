import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductsService extends DefaultService {
    override formName = 'products';
    private readonly requestFrom = 'products';

    override getUrl(): string {
        return 'api/products';
    }

    override insert(form: any) {
        return this._http
            .post(this.getTableUrl(), this.toProductPayload(form))
            .pipe(tap(() => this.loadDataTable()));
    }

    override update(form: any, id: any) {
        return this._http
            .put(`${this.getTableUrl()}/${id}`, this.toProductPayload(form))
            .pipe(tap(() => this.loadDataTable()));
    }

    override delete(id: any) {
        return this._http
            .delete(`${this.getTableUrl()}/${id}`, { params: { requestFrom: this.requestFrom } })
            .pipe(tap(() => this.loadDataTable()));
    }

    private toProductPayload(form: any) {
        return {
            name: String(form?.name ?? '').trim(),
            price: Number(form?.price),
            requestFrom: this.requestFrom
        };
    }
}
