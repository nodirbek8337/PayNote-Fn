import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() modalShow: boolean = false;
  @Input() modalTitle: string = 'Title';
  @Output() modalClose = new EventEmitter<boolean>();

  closeModal() {
    this.modalClose.emit(false);
  }
}
