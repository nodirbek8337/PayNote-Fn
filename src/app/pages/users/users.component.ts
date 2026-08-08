import { Component, inject } from '@angular/core';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { UsersService } from '../service/users.service';
import { NgIf } from '@angular/common';
import { UsersFormComponent } from './form/users-form.component';
import { UsersFilterComponent } from './filter/users-filter.component';
import { CustomActiveBadgeComponent } from '../../shared/components/badge/custom-active-renderer.component';

@Component({
    selector: 'users',
    standalone: true,
    imports: [PrimeDatatableComponent, NgIf],
    templateUrl: './users.component.html'
})
export class UsersComponent {
    _defaultService = inject(UsersService);

    FormComponent = UsersFormComponent;
    FilterComponent = UsersFilterComponent;

    columnDefs = [
        { field: 'username', header: 'Username', widthClass: 'w-40p', sortable: false, placeholder: 'Username kiriting' },
        {
            field: 'role',
            header: 'Roli',
            widthClass: 'w-20p',
            sortable: false,
            placeholder: 'Rol tanlang',
            cellRendererFn: (row: any, field: string) => this.formatRole(row[field])
        },
        {
            field: 'isActive',
            header: 'Holati',
            widthClass: 'w-15p',
            sortable: false,
            searchable: false,
            cellRendererComponent: CustomActiveBadgeComponent
        },
        {
            field: 'createdAt',
            header: 'Yaratilgan sana',
            filterType: 'date-range',
            widthClass: 'w-15p',
            sortable: false,
            placeholder: 'Yaratilgan sanani tanlang',
            cellRendererFn: (row: any, field: string) => this.formatUserDate(row[field])
        }
    ];

    private formatRole(role: string): string {
        const label = role === 'admin' ? 'Boshliq' : role === 'user' ? 'Ishchi' : role || '-';
        return `<span>${label}</span>`;
    }

    private formatUserDate(value: string): string {
        if (!value) return '<span>-</span>';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '<span>-</span>';

        const months = [
            'yanvar',
            'fevral',
            'mart',
            'aprel',
            'may',
            'iyun',
            'iyul',
            'avgust',
            'sentabr',
            'oktabr',
            'noyabr',
            'dekabr'
        ];
        const dateText = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        const timeText = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        return `<span title="${date.toISOString()}">${dateText}, ${timeText}</span>`;
    }
}
