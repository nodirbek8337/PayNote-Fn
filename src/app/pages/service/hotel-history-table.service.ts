import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DefaultService } from '../../shared/services/default.service';

/** Band qilishlar tarixi API pagination qaytarmaydi; DataTable uchun lokal adapter. */
@Injectable()
export class HotelHistoryTableService extends DefaultService {
  formName = 'hotel-history-table';
  private sourceRows: any[] = [];

  public constructor() {
    super();
  }

  getUrl(): string {
    return 'api/hotel/history';
  }

  setRows(rows: any[]) {
    this.sourceRows = Array.isArray(rows) ? rows : [];
  }

  override reloadTable() {
    return of((() => {
      const params = this.tableRequest.getParams() as Record<string, unknown>;
      const normalize = (value: unknown) => String(value ?? '').trim().toLocaleLowerCase('uz');
      const search = normalize(params['search']);
      const roomNumber = normalize(params['roomNumber']);
      const guestName = normalize(params['guestName']);
      const from = params['createdAt_from'] ? new Date(String(params['createdAt_from'])) : null;
      const to = params['createdAt_to'] ? new Date(String(params['createdAt_to'])) : null;
      const filtered = this.sourceRows.filter((booking: any) => {
        const matchesSearch = !search || [booking.roomNumber, booking.guestName, booking.guestsCount, booking.daysCount].some((value) => normalize(value).includes(search));
        const createdAt = new Date(booking.createdAt);
        const matchesDate = (!from || Number.isNaN(from.getTime()) || createdAt >= from) && (!to || Number.isNaN(to.getTime()) || createdAt <= to);
        return matchesSearch && matchesDate && (!roomNumber || normalize(booking.roomNumber).includes(roomNumber)) && (!guestName || normalize(booking.guestName).includes(guestName));
      });
      const amountTotals = filtered.reduce((totals: { UZS: number; USD: number }, booking: any) => {
        const payments = Array.isArray(booking.payments) && booking.payments.length ? booking.payments : [
          { currency: 'UZS', amount: booking.agreedTotals?.UZS ?? 0 },
          { currency: 'USD', amount: booking.agreedTotals?.USD ?? 0 }
        ];
        for (const payment of payments) {
          const currency = payment.currency === 'USD' ? 'USD' : 'UZS';
          const amount = Number(payment.amount ?? 0);
          if (Number.isFinite(amount)) totals[currency] += amount;
        }
        return totals;
      }, { UZS: 0, USD: 0 });
      const total = filtered.length;
      const page = Math.max(1, Number(params['page']) || 1);
      const perPage = Math.max(1, Number(params['per_page']) || total || 15);
      return { success: true, data: filtered.slice((page - 1) * perPage, page * perPage), pagination: { total }, amount_totals: amountTotals };
    })());
  }
}
