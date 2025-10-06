import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-date-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span>
      {{ rowData?.[field] | date: displayFormat : undefined : 'uz' }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDateRendererComponent {
  @Input() rowData!: any;
  @Input() field!: string;

  @Input() displayFormat: string = 'd MMMM y, HH:mm';
}
