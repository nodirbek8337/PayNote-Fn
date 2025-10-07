import { Component, inject } from '@angular/core';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { ContactsService } from '../service/contacts.service';
import { NgIf } from '@angular/common';
import { ContactsFormComponent } from './form/contacts-form.component';
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
    providers: [DateFormatPipe, PhoneNumberPipe]
})
export class ContactsComponent {
    _defaultService = inject(ContactsService);
    private _phoneNumberFormat = inject(PhoneNumberPipe);

    FormComponent = ContactsFormComponent;
    FilterComponent = ContactsFilterComponent;

    columnDefs = [
        { field: 'name', header: 'Ism, Familiya', widthClass: 'w-25p', sortable: false, placeholder: 'Ism' },
        {
            field: 'amount',
            header: 'Miqdor',
            widthClass: 'w-20p',
            sortable: false,
            searchable: false,
            cellRendererComponent: CustomAmountRendererComponent
        },
        {
            field: 'phone',
            header: 'Telefon',
            widthClass: 'w-20p',
            sortable: false,
            placeholder: 'Telefon',
            cellRendererFn: (row: any, field: string) => {
                const formatted = this._phoneNumberFormat.transform(row[field]);
                return `<span>${formatted}</span>`;
            }
        },
        // {
        //     field: 'note',
        //     header: 'Izoh',
        //     widthClass: 'w-20p',
        //     sortable: false,
        //     searchable: false,
        // },
        {
            field: 'createdAt',
            header: 'Yaratilgan vaqt',
            filterType: 'date-range',
            widthClass: 'w-15p',
            sortable: false,
            cellRendererComponent: CustomDateRendererComponent
        }
        // {
        //     field: 'updatedAt',
        //     header: 'Yangilangan vaqt',
        //     filterType: 'date-range',
        //     widthClass: 'w-10p',
        //     sortable: false,
        //     cellRendererComponent: CustomDateRendererComponent
        // }
    ];
}
