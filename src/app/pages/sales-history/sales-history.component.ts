import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { ICustomAction } from '../../shared/interfaces/custom-action.interface';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { SalesHistoryService } from '../service/sales-history.service';
import { UsersFilterComponent } from '../users/filter/users-filter.component';

@Component({
    selector: 'sales-history',
    standalone: true,
    imports: [CommonModule, DialogModule, PrimeDatatableComponent, MoneyPipe],
    templateUrl: './sales-history.component.html',
    styleUrls: ['./sales-history.component.scss'],
    providers: [MoneyPipe]
})
export class SalesHistoryComponent {
    _defaultService = inject(SalesHistoryService);
    private moneyPipe = inject(MoneyPipe);
    FilterComponent = UsersFilterComponent;

    selectedSale: any = null;
    detailsVisible = false;

    customActions: ICustomAction[] = [
        {
            icon: 'pi pi-eye',
            TooltipTitle: "Ko'rish",
            color: 'info',
            action: (row) => this.openDetails(row)
        }
    ];

    columnDefs = [
        {
            field: 'items',
            header: 'Maxsulotlar',
            widthClass: 'w-25p',
            sortable: false,
            searchable: false,
            cellRendererFn: (row: any) => `<span>${this.formatItemsSummary(row.items)}</span>`
        },
        {
            field: 'total',
            header: 'Umumiy narxi',
            widthClass: 'w-15p',
            sortable: false,
            searchable: false,
            cellRendererFn: (row: any) => `<strong>${this.moneyPipe.transform(row.total, 'UZS')}</strong>`
        },
        {
            field: 'paymentMethod',
            header: "To'lov turi",
            widthClass: 'w-15p',
            sortable: false,
            filterType: 'dropdown',
            filterOptions: [
                { label: "Naqd to'lov", value: 'CASH' },
                { label: 'Karta orqali', value: 'CARD' },
                { label: 'Boshqa usul', value: 'OTHER' }
            ],
            cellRendererFn: (row: any) => `<span>${this.getPaymentMethodLabel(row.paymentMethod)}</span>`
        },
        {
            field: 'note',
            header: 'Eslatma',
            widthClass: 'w-20p',
            sortable: false,
            searchable: false,
            placeholder: 'Eslatma kiriting',
            cellRendererFn: (row: any) => `<span>${row.note || '-'}</span>`
        },
        {
            field: 'soldByUsername',
            header: 'Kim sotdi',
            widthClass: 'w-15p',
            sortable: false,
            searchable: false,
            placeholder: 'Username kiriting',
            cellRendererFn: (row: any) => `<span>${row.soldByUsername ?? '-'}</span>`
        },
        {
            field: 'createdAt',
            header: 'Sotilgan vaqt',
            widthClass: 'w-20p',
            filterType: 'date-range',
            sortable: false,
            placeholder: 'Sotilgan vaqtni tanlang',
            cellRendererFn: (row: any) => `<span>${this.formatDate(row.createdAt)}</span>`
        }
    ];

    openDetails(row: any): void {
        this.selectedSale = row;
        this.detailsVisible = true;
    }

    get selectedItems(): any[] {
        return Array.isArray(this.selectedSale?.items) ? this.selectedSale.items : [];
    }

    get selectedTotal(): number {
        return Number(this.selectedSale?.total ?? 0);
    }

    getPaymentMethodLabel(value: string): string {
        const labels: Record<string, string> = {
            CASH: "Naqd to'lov",
            CARD: 'Karta orqali',
            OTHER: 'Boshqa usul'
        };
        return labels[value] ?? '-';
    }

    formatDate(value: string): string {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';

        const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    private formatItemsSummary(items: any[]): string {
        if (!Array.isArray(items) || !items.length) return '-';
        const totalAmount = items.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
        return `${items.length} turdagi maxsulot, ${totalAmount} ta`;
    }
}
