import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'datepicker-range',
  standalone: true,
  templateUrl: './datepicker-range.component.html',
  imports: [FormsModule, DatePickerModule],
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

    const start = new Date(this.value[0]);
    const end   = new Date(this.value[1] ?? this.value[0]);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    this.value = [start, end];
    this.valueChange.emit(this.value);
  }

  clear() {
    this.value = null;
    this.valueChange.emit(null);
  }
}
