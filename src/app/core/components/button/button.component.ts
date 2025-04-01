import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'kep-button',
  imports: [RouterModule, NgClass, NgStyle],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() buttonText: string = 'Button';
  @Input() buttonClass: string = '';
  @Input() buttonType: string = 'button';
  @Input() buttonWidth: string = '60px';
  @Input() link: boolean = false;
  @Input() linkUrl: string = '';

  @Output() buttonClick = new EventEmitter<void>();

  isClicked: boolean = false;

  onClick(event: Event) {
    event.preventDefault();
    this.isClicked = true;

    this.buttonClick.emit();

    setTimeout(() => {
      this.isClicked = false;
    }, 200);
  }
}
