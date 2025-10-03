import { Component, inject } from '@angular/core';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { ContactsService } from './contacts.service';
import { NgIf } from '@angular/common';
import { ContactsFormComponent } from './form/contacts-form.component';
import { ICustomAction } from '../../shared/interfaces/custom-action.interface';
import { CustomDateRendererComponent } from '../../shared/components/badge/custom-date-renderer.component';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { PhoneNumberPipe } from '../../shared/pipes/phone-number.pipe';
import { ContactsFilterComponent } from './filter/contacts-filter.component';
import { CustomAmountRendererComponent } from '../../shared/components/badge/custom-amount-renderer.component';

@Component({
    selector: 'contacts',
    standalone: true,
    imports: [PrimeDatatableComponent, NgIf],
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    providers: [DateFormatPipe, PhoneNumberPipe],
})
export class ContactsComponent {
    _defaultService = inject(ContactsService);
    private _dateFormat = inject(DateFormatPipe);
    private _phoneNumberFormat = inject(PhoneNumberPipe);

    FormComponent = ContactsFormComponent;
    FilterComponent = ContactsFilterComponent;

    columnDefs = [
        { field: 'name', header: 'Name', widthClass: 'w-15p', sortable: false, placeholder: 'Ism', },
        {
            field: 'phone',
            header: 'Phone',
            widthClass: 'w-10p',
            sortable: false,
            placeholder: 'Telefon',
            cellRendererFn: (row: any, field: string) => {
                const formatted = this._phoneNumberFormat.transform(row[field]);
                return `<span>${formatted}</span>`;
            }
        },
        {
            field: 'amount',
            header: 'Amount',
            widthClass: 'w-15p',
            sortable: false,
            searchable: false,
            cellRendererComponent: CustomAmountRendererComponent,
        },
        {
            field: 'note',
            header: 'Note',
            widthClass: 'w-20p',
            sortable: false,
            searchable: false,
        },
        {
            field: 'createdAt',
            header: 'createdAt',
            filterType: 'date-range',
            widthClass: 'w-10p',
            sortable: false,
            placeholder: 'Yaratilgan vaqti',
            cellRendererComponent: CustomDateRendererComponent
        },
        {
            field: 'updatedAt',
            header: 'UpdatedAt',
            filterType: 'date-range',
            widthClass: 'w-10p',
            sortable: false,
            placeholder: 'Yangilangan vaqti',
            cellRendererFn: (row: any, field: string) => {
                const formatted = this._dateFormat.transform(row[field]);
                return `<span>${formatted}</span>`;
            }
        }
    ];

    customRowActions: ICustomAction[] = [
        // {
        //     icon: 'pi pi-eye',
        //     tooltip: 'Ko‘rish',
        //     color: 'info',
        //     action: (row) => {
        //         console.log('Ko‘rilayotgan ID:', row._id);
        //     }
        // },
        // {
        //     icon: 'pi pi-send',
        //     tooltip: 'Email yuborish',
        //     color: 'success',
        //     action: (row) => {
        //         alert('Email yuborilmoqda: ' + row.email);
        //     }
        // }
    ];
}
