import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

type ToastLife = number | undefined;

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private ms: MessageService) {}

  success(detail: string, summary = 'Muvaffaqiyatli', key = 'global', life: ToastLife = 3000) {
    this.ms.add({ key, severity: 'success', summary, detail, life });
  }

  error(detail: string, summary = 'Xatolik', key = 'global', life: ToastLife = 4000) {
    this.ms.add({ key, severity: 'error', summary, detail, life });
  }

  info(detail: string, summary = 'Maʼlumot', key = 'global', life: ToastLife = 3000) {
    this.ms.add({ key, severity: 'info', summary, detail, life });
  }

  warn(detail: string, summary = 'Ogohlantirish', key = 'global', life: ToastLife = 3500) {
    this.ms.add({ key, severity: 'warn', summary, detail, life });
  }

  clear(key = 'global') {
    this.ms.clear(key);
  }
}
