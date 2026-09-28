import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { MySalesSummary, SalesPeriodSummary, SalesService } from '../service/sales.service';
import { HotelService } from '../service/hotel.service';

@Component({
    selector: 'app-cabinet',
    standalone: true,
    imports: [CommonModule, MoneyPipe],
    templateUrl: './cabinet.component.html',
    styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit {
    private salesService = inject(SalesService);
    private hotelService = inject(HotelService);
    private authService = inject(AuthService);

    loading = false;
    user = this.authService.getCurrentUser();
    summary: MySalesSummary = {
        today: this.emptyPeriod(),
        month: this.emptyPeriod()
    };
    hotelSummary: any = { today: { bookingCount: 0, paid: { UZS: 0, USD: 0 }, paymentByMethod: {} }, month: { bookingCount: 0, paid: { UZS: 0, USD: 0 }, paymentByMethod: {} } };

    ngOnInit(): void {
        this.loadSummary();
    }

    loadSummary(): void {
        this.loading = true;
        if (this.isHotelManager) {
            this.hotelService.summary().pipe(finalize(() => (this.loading = false))).subscribe((response) => this.hotelSummary = response?.data ?? this.hotelSummary);
            return;
        }
        if (this.isAdmin) {
            forkJoin({ sales: this.salesService.getMySummary(), hotel: this.hotelService.summary() })
                .pipe(finalize(() => (this.loading = false)))
                .subscribe(({ sales, hotel }) => {
                    if (sales?.data) {
                        this.summary = { today: this.normalizePeriod(sales.data.today), month: this.normalizePeriod(sales.data.month) };
                    }
                    this.hotelSummary = hotel?.data ?? this.hotelSummary;
                });
            return;
        }
        this.salesService
            .getMySummary()
            .pipe(finalize(() => (this.loading = false)))
            .subscribe((response) => {
                if (response?.data) {
                    this.summary = {
                        today: this.normalizePeriod(response.data.today),
                        month: this.normalizePeriod(response.data.month)
                    };
                }
            });
    }

    get roleLabel(): string {
        return this.user?.role === 'admin' ? 'Boshliq' : this.user?.role === 'manager' ? 'Mehmonxona manageri' : 'Muzlatgich ishchisi';
    }

    get isHotelManager(): boolean { return this.authService.isHotelManager(); }
    get isAdmin(): boolean { return this.authService.isAdmin(); }

    hotelMethods(period: string): Array<{ method: string; totals: any }> {
        return Object.entries(this.hotelSummary?.[period]?.paymentByMethod ?? {}).map(([method, totals]) => ({ method, totals }));
    }

    paymentMethodLabel(method: string): string {
        return ({ CASH: 'Naqd', TERMINAL: 'Terminal', CARD: 'Karta', EXPEDIA: 'Expedia', BOOKING: 'Booking' } as Record<string, string>)[method] ?? method;
    }

    private emptyPeriod(): SalesPeriodSummary {
        return { salesCount: 0, itemCount: 0, totals: { UZS: 0, USD: 0 }, products: [] };
    }

    private normalizePeriod(period?: Partial<SalesPeriodSummary> | null): SalesPeriodSummary {
        return {
            salesCount: Number(period?.salesCount ?? 0),
            itemCount: Number(period?.itemCount ?? 0),
            totals: { UZS: Number(period?.totals?.UZS ?? 0), USD: Number(period?.totals?.USD ?? 0) },
            products: Array.isArray(period?.products) ? period.products.map((product) => ({ ...product, currency: product.currency === 'USD' ? 'USD' : 'UZS' })) : []
        };
    }
}
