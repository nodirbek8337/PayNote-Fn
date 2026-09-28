import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { injectViewUpdates } from '../../shared/utils/view-updates';
import { finalize, switchMap, tap } from 'rxjs/operators';
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

    private readonly viewUpdates = injectViewUpdates();
    private loadingState = signal(false);
    get loading(): boolean { return this.loadingState(); }
    errorMessage = '';
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
        if (this.loading) return;
        this.errorMessage = '';
        this.loadingState.set(true);

        const sales$ = this.salesService.getMySummary().pipe(tap((response) => {
            if (response?.success !== true || !response.data) {
                throw new Error('Sotuvlar hisobini olishda xatolik.');
            }
            this.summary = {
                today: this.normalizePeriod(response.data.today),
                month: this.normalizePeriod(response.data.month)
            };
        }));
        const hotel$ = this.hotelService.summary().pipe(tap((response) => {
            if (response?.success !== true || !response.data) {
                throw new Error('Mehmonxona hisobini olishda xatolik.');
            }
            this.hotelSummary = response.data;
        }));

        // Admin loads sales first, then hotel; each endpoint is subscribed once.
        const request$ = this.isHotelManager ? hotel$ : this.isAdmin ? sales$.pipe(switchMap(() => hotel$)) : sales$;
        request$.pipe(
            finalize(() => this.loadingState.set(false)),
            this.viewUpdates()
        ).subscribe({
            error: () => {
                this.errorMessage = 'Hisoblarni yuklab bo‘lmadi. Yangilash tugmasini qayta bosing.';
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
