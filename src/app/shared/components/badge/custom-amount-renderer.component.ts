import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignClassPipe } from "../../pipes/sign-class.pipe";
import { MoneyPipe } from "../../pipes/money.pipe";

@Component({
  selector: 'app-custom-amount-renderer',
  standalone: true,
  imports: [CommonModule, SignClassPipe, MoneyPipe],
  template: `
    <span
      [ngClass]="rowData?.[field] | signClass">
      {{
        rowData?.[field]
          | money:(rowData?.[field + 'Currency'] || rowData?.currency || rowData?.currencyCode || 'UZS')
                 : locale
                 : currencyDisplay
      }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomAmountRendererComponent {
  @Input() rowData!: any;
  @Input() field!: string;

  @Input() locale = 'uz-UZ';
  @Input() currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name' = 'narrowSymbol';
}
