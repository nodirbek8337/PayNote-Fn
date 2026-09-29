import { Component, inject } from '@angular/core';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { CustomActiveBadgeComponent } from '../../shared/components/badge/custom-active-renderer.component';
import { UsersFilterComponent } from '../users/filter/users-filter.component';
import { HotelReportSchedulesService } from '../service/hotel-report-schedules.service';
import { HotelReportFormComponent } from './form/hotel-report-form.component';

@Component({
    selector: 'app-hotel-reports',
    standalone: true,
    imports: [PrimeDatatableComponent],
    templateUrl: './hotel-reports.component.html',
    styleUrl: './hotel-reports.component.scss'
})
export class HotelReportsComponent {
    readonly _defaultService = inject(HotelReportSchedulesService);
    readonly FormComponent = HotelReportFormComponent;
    readonly FilterComponent = UsersFilterComponent;

    readonly columnDefs = [
        { field: 'name', header: 'Hisobot nomi', widthClass: 'w-25p', sortable: false, placeholder: 'Hisobot nomini qidiring' },
        {
            field: 'type', header: 'Turi', widthClass: 'w-15p', sortable: false, filterType: 'dropdown',
            filterOptions: [{ label: 'Kunlik', value: 'DAILY' }, { label: 'Haftalik', value: 'WEEKLY' }, { label: 'Oylik', value: 'MONTHLY' }],
            placeholder: 'Hisobot turini tanlang', cellRendererFn: (row: any) => `<span>${this.typeLabel(row.type)}</span>`
        },
        {
            field: 'period', header: 'Hisobot oralig‘i', widthClass: 'w-25p', sortable: false, searchable: false,
            cellRendererFn: (row: any) => `<span>${this.periodLabel(row)}</span>`
        },
        {
            field: 'sendTime', header: 'Yuborish vaqti', widthClass: 'w-15p', sortable: false, searchable: false,
            cellRendererFn: (row: any) => `<strong>${this.formatTime(row.sendTime)}</strong>`
        },
        {
            field: 'isActive', header: 'Holati', widthClass: 'w-15p', sortable: false, filterType: 'dropdown',
            filterOptions: [{ label: 'Faol', value: 'true' }, { label: 'Faol emas', value: 'false' }],
            placeholder: 'Holatni tanlang', cellRendererComponent: CustomActiveBadgeComponent
        }
    ];

    private typeLabel(type: string): string {
        return type === 'DAILY' ? 'Kunlik' : type === 'WEEKLY' ? 'Haftalik' : type === 'MONTHLY' ? 'Oylik' : '-';
    }

    private periodLabel(schedule: any): string {
        if (schedule.type === 'DAILY') return `Kechagi ${this.formatTime(schedule.sendTime)} — bugungi ${this.formatTime(schedule.sendTime)}`;
        if (schedule.type === 'WEEKLY') return `Oldingi ${this.weekDayLabel(schedule.weekDay)} ${this.formatTime(schedule.sendTime)} — joriy ${this.weekDayLabel(schedule.weekDay)} ${this.formatTime(schedule.sendTime)}`;
        if (schedule.type === 'MONTHLY') return `Oldingi oy oxiri ${this.formatTime(schedule.sendTime)} — joriy oy oxiri ${this.formatTime(schedule.sendTime)}`;
        return '-';
    }

    private formatTime(value: unknown): string {
        const match = String(value ?? '').trim().match(/^(\d{1,2})(?::(\d{1,2}))?$/);
        if (!match) return '--:--';

        const hour = Number(match[1]);
        const minute = Number(match[2] ?? 0);
        if (hour > 23 || minute > 59) return '--:--';
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    private weekDayLabel(day: number | null | undefined): string {
        return ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'][Number(day)] || 'hafta kuni';
    }
}
