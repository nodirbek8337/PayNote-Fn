import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type SalesProduct = {
    _id: string;
    productId?: string;
    name: string;
    price: number;
    amount: number;
};

export type SalePayloadItem = {
    productId: string;
    amount: number;
};

@Injectable({ providedIn: 'root' })
export class SalesService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getProducts(params: Record<string, string | number> = {}): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/products`, { params });
    }

    sell(items: SalePayloadItem[]): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/sales`, {
            requestFrom: 'sales',
            items
        });
    }
}
