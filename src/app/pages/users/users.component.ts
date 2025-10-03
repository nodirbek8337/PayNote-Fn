import { Component, inject } from '@angular/core';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { UsersService } from '../service/users.service';
import { NgIf } from '@angular/common';
import { UsersFormComponent } from './form/users-form.component';
import { ICustomAction } from '../../shared/interfaces/custom-action.interface';
import { CustomDateRendererComponent } from '../../shared/components/badge/custom-date-renderer.component';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { PhoneNumberPipe } from '../../shared/pipes/phone-number.pipe';
import { UsersFilterComponent } from './filter/users-filter.component';
import { CustomActiveBadgeComponent } from '../../shared/components/badge/custom-active-renderer.component';

@Component({
    selector: 'users',
    standalone: true,
    imports: [PrimeDatatableComponent, NgIf],
    templateUrl: './users.component.html',
    providers: [DateFormatPipe, PhoneNumberPipe]
})
export class UsersComponent {
    _defaultService = inject(UsersService);
    private _dateFormat = inject(DateFormatPipe);
    private _phoneNumberFormat = inject(PhoneNumberPipe);

    FormComponent = UsersFormComponent;
    FilterComponent = UsersFilterComponent;

    columnDefs = [
        { field: 'username', header: 'username', widthClass: 'w-40p', sortable: false, placeholder: 'username' },
        {
            field: 'role',
            header: 'role',
            widthClass: 'w-10p',
            sortable: false,
            placeholder: 'role'
        },
        {
            field: 'isActive',
            header: 'isActive',
            widthClass: 'w-10p',
            sortable: false,
            searchable: false,
            cellRendererComponent: CustomActiveBadgeComponent
        },
        {
            field: 'createdAt',
            header: 'createdAt',
            filterType: 'date-range',
            widthClass: 'w-15p',
            sortable: false,
            placeholder: 'Yaratilgan vaqti',
            cellRendererComponent: CustomDateRendererComponent
        },
        {
            field: 'updatedAt',
            header: 'UpdatedAt',
            filterType: 'date-range',
            widthClass: 'w-15p',
            sortable: false,
            placeholder: 'Yangilangan vaqti',
            cellRendererComponent: CustomDateRendererComponent
        }
    ];
}
