import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalDataSubject = new BehaviorSubject<any>({});
  modalData$ = this.modalDataSubject.asObservable();

  openModal(data: any) {
    this.modalDataSubject.next(data);
  }

  closeModal() {
    this.modalDataSubject.next(null);
  }
}
