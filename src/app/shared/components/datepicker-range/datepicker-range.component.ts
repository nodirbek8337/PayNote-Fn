import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'datepicker-range',
    standalone: true,
    templateUrl: './datepicker-range.component.html',
    imports: [FormsModule, DatePickerModule]
})
export class DatepickerRangeComponent {
    @Input() value: Date[] | null = null;
    @Output() valueChange = new EventEmitter<Date[] | null>();

    @Input() placeholder: string = 'Sanani tanlang';
    @Input() dateFormat: string = 'dd-mm-yy';
    @Input() showTime: boolean = false;
    @Input() baseZIndex = 2000;

    onSelect() {
        if (!this.value || !this.value[0]) return;

        const startOfDay = (d: Date) => {
            const x = new Date(d);
            x.setHours(0, 0, 0, 0);
            return x;
        };
        const endOfDay = (d: Date) => {
            const x = new Date(d);
            x.setHours(23, 59, 59, 999);
            return x;
        };

        if (!this.value[1]) {
            this.value = [startOfDay(this.value[0])];
            return;
        }

        let a = startOfDay(this.value[0]);
        let b = endOfDay(this.value[1]);

        if (b < a) {
            a = startOfDay(this.value[1]);
            b = endOfDay(this.value[0]);
        }

        this.value = [a, b];
        this.valueChange.emit(this.value);
    }

    clear() {
        this.value = null;
        this.valueChange.emit(null);
    }
}
