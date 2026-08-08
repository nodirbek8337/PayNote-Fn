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

export type SalesPeriodSummary = {
    salesCount: number;
    itemCount: number;
    total: number;
    products: SalesSummaryProduct[];
};

export type SalesSummaryProduct = {
    productId: string;
    name: string;
    amount: number;
    total: number;
};

export type MySalesSummary = {
    today: SalesPeriodSummary;
    month: SalesPeriodSummary;
};

@Injectable({ providedIn: 'root' })
export class SalesService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getProducts(params: Record<string, string | number> = {}): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/sales/products`, { params });
    }

    getMySummary(): Observable<{ success: boolean; data: MySalesSummary }> {
        return this.http.get<{ success: boolean; data: MySalesSummary }>(`${this.baseUrl}/api/sales/me/summary`);
    }

    sell(items: SalePayloadItem[]): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/sales`, {
            requestFrom: 'sales',
            items
        });
    }
}
