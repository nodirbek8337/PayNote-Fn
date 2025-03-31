import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'kep-button',
  imports: [RouterModule, NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() buttonText: string = 'Button';
  @Input() buttonClass: string = '';
  @Input() buttonType: string = 'button';
  @Input() link: boolean = false;
  @Input() linkUrl: string = '';
  isClicked: boolean = false;

  onClick(event: Event) {
    event.preventDefault();
    this.isClicked = true;

    setTimeout(() => {
      this.isClicked = false;
    }, 200);
  }
}
