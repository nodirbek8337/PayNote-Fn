import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { MySalesSummary, SalesPeriodSummary, SalesService } from '../service/sales.service';

@Component({
    selector: 'app-cabinet',
    standalone: true,
    imports: [CommonModule, MoneyPipe],
    templateUrl: './cabinet.component.html',
    styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit {
    private salesService = inject(SalesService);
    private authService = inject(AuthService);

    loading = false;
    user = this.authService.getCurrentUser();
    summary: MySalesSummary = {
        today: this.emptyPeriod(),
        month: this.emptyPeriod()
    };

    ngOnInit(): void {
        this.loadSummary();
    }

    loadSummary(): void {
        this.loading = true;
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
        return this.user?.role === 'admin' ? 'Boshliq' : 'Ishchi';
    }

    private emptyPeriod(): SalesPeriodSummary {
        return { salesCount: 0, itemCount: 0, total: 0, products: [] };
    }

    private normalizePeriod(period?: Partial<SalesPeriodSummary> | null): SalesPeriodSummary {
        return {
            salesCount: Number(period?.salesCount ?? 0),
            itemCount: Number(period?.itemCount ?? 0),
            total: Number(period?.total ?? 0),
            products: Array.isArray(period?.products) ? period.products : []
        };
    }
}
