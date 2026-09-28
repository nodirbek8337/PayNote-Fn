import { Component, Input } from '@angular/core';
import { ICustomAction } from '../../../interfaces/custom-action.interface';

import { ButtonDirective } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'datatable-actions',
    standalone: true,
    template: `
        @if (actions.length) {
            @for (btn of actions; track btn) {
                @if (!isHidden(btn)) {
                    <button pButton [class]="'p-button-sm p-button-text datatable-custom-action datatable-custom-action--' + (btn.color || 'secondary')" [title]="btn.tooltip" [disabled]="isDisabled(btn)" (click)="btn.action(row)" [pTooltip]="btn.TooltipTitle || btn.tooltip" tooltipPosition="top">
                        <i [class]="btn.icon"></i>
                    </button>
                }
            }
        }
    `,
    styles: [],
    imports: [ButtonDirective, TooltipModule]
})
export class DatatableActionsComponent {
    @Input() row: any;
    @Input() actions: ICustomAction[] = [];

    isDisabled(action: ICustomAction) {
        return typeof action.disabled === 'function' ? action.disabled(this.row) : !!action.disabled;
    }

    isHidden(action: ICustomAction) {
        return typeof action.hidden === 'function' ? action.hidden(this.row) : !!action.hidden;
    }
}
