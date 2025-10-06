import { Component, Input } from '@angular/core';
import { ICustomAction } from '../../../interfaces/custom-action.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'datatable-actions',
  standalone: true,
  template: `
    <ng-container *ngIf="actions?.length">
      <button
        *ngFor="let btn of actions"
        pButton
        [icon]="btn.icon"
        [class]="'p-button-sm p-button-text me-2 p-button-' + (btn.color || 'secondary')"
        [title]="btn.tooltip"
        [disabled]="btn.disabled"
        (click)="btn.action(row)"
        [pTooltip]="btn.TooltipTitle" 
        tooltipPosition="top"
      ></button>
    </ng-container>
  `,
  styles: [],
  imports: [CommonModule, ButtonModule, TooltipModule]
})
export class DatatableActionsComponent {
  @Input() row: any;
  @Input() actions: ICustomAction[] = [];
}
