import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../shared/services/auth.service';
import { HotelService } from '../service/hotel.service';

type Currency = 'UZS' | 'USD';
type Payment = { amount: number | null; currency: Currency; method: string; note: string };

@Component({
  selector: 'app-hotel', standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputComponent, SelectComponent],
  templateUrl: './hotel.component.html', styleUrl: './hotel.component.scss',
})
export class HotelComponent implements OnInit {
  private hotel = inject(HotelService); private toast = inject(ToastService); private auth = inject(AuthService); private route = inject(ActivatedRoute);
  rooms: any[] = []; bookings: any[] = []; history: any[] = []; loading = false;
  bookingDialog = false; roomDialog = false; paymentDialog = false; section: 'bookings' | 'rooms' | 'history' = 'bookings';
  editingBooking: any | null = null; editingRoom: any | null = null;
  readonly methods = [{ value: 'CASH', label: 'Naqd' }, { value: 'TERMINAL', label: 'Terminal' }, { value: 'CARD', label: 'Karta' }, { value: 'EXPEDIA', label: 'Expedia' }, { value: 'BOOKING', label: 'Booking' }];
  readonly currencies = [{ value: 'UZS', label: 'UZS' }, { value: 'USD', label: 'USD' }];
  readonly statuses = [{ value: 'RESERVED', label: 'Buyurtma qilingan' }, { value: 'CHECKED_IN', label: 'Mehmon joylashgan' }, { value: 'CHECKOUT_DUE', label: 'Chiqishi kutilmoqda' }, { value: 'CHECKED_OUT', label: 'Chiqib ketgan' }, { value: 'CANCELLED', label: 'Bekor qilingan' }, { value: 'CLEANING', label: 'Tozalashda' }];
  bookingForm: any = this.blankBooking(); roomForm: any = this.blankRoom(); payment: Payment = this.blankPayment();
  get isAdmin() { return this.auth.isAdmin(); }
  get canManageRooms() { return this.auth.isAdmin(); }
  get isRoomCatalog() { return this.section === 'rooms'; }
  get canSeeHistory() { return this.isAdmin && this.section === 'history'; }

  ngOnInit() { this.route.data.subscribe(d => { this.section = d['section'] === 'rooms' ? 'rooms' : d['section'] === 'history' ? 'history' : 'bookings'; this.load(); }); }
  private defaultDate(days = 0) { const d = new Date(); d.setDate(d.getDate() + days); d.setHours(12, 0, 0, 0); return this.localDateTime(d); }
  private localDateTime(d: Date) { const pad = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; }
  private blankPayment(): Payment { return { amount: null, currency: 'UZS', method: 'CASH', note: '' }; }
  private blankBooking() { return { roomId: '', guestName: '', guestPhone: '', guestsCount: 1, daysCount: 1, checkIn: this.defaultDate(), checkOut: this.defaultDate(1), status: 'RESERVED', agreedUZS: null, agreedUSD: null, payments: [] as Payment[], changeNote: '' }; }
  private blankRoom() { return { number: '', name: '', capacity: 1, note: '' }; }

  load() { this.loading = true; const from = new Date(); from.setDate(1); const to = new Date(from.getFullYear(), from.getMonth()+1, 1); this.hotel.rooms().subscribe({ next: r => { this.rooms = r.data ?? []; this.hotel.bookings(this.ymd(from), this.ymd(to)).subscribe({ next: b => { this.bookings = b.data ?? []; this.loadHistoryIfNeeded(); }, error: () => this.loading = false }); }, error: () => this.loading = false }); }
  private loadHistoryIfNeeded() { if (!this.canSeeHistory) { this.loading = false; return; } this.hotel.history().subscribe({ next: r => { this.history = r.data ?? []; this.loading = false; }, error: () => this.loading = false }); }
  private ymd(d: Date) { return d.toISOString().slice(0,10); }
  roomBookings(room: any) { return this.bookings.filter(b => String(b.roomId) === String(room._id)); }
  activeBooking(room: any) { return this.roomBookings(room).find(b => ['RESERVED','CHECKED_IN','CHECKOUT_DUE'].includes(b.status)); }
  roomState(room: any) { const b = this.activeBooking(room); return b ? this.statusLabel(b.status) : room.isActive ? 'Bo\'sh' : 'Faolsiz'; }
  statusLabel(value: string) { return this.statuses.find(s => s.value === value)?.label ?? value; }

  openBooking(room?: any, booking?: any) { this.editingBooking = booking ?? null; this.bookingForm = booking ? { ...booking, guestsCount: Number(booking.guestsCount ?? 1), daysCount: Number(booking.daysCount ?? this.daysBetween(booking.checkIn, booking.checkOut)), roomId: String(booking.roomId), checkIn: this.localDateTime(new Date(booking.checkIn)), checkOut: this.localDateTime(new Date(booking.checkOut)), agreedUZS: Number(booking.agreedTotals?.UZS || 0) || null, agreedUSD: Number(booking.agreedTotals?.USD || 0) || null, payments: [], changeNote: '' } : { ...this.blankBooking(), roomId: String(room?._id ?? '') }; this.updateCheckout(); this.bookingDialog = true; }
  private daysBetween(checkIn: string | Date, checkOut: string | Date) { return Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000)); }
  updateCheckout() { const start = new Date(this.bookingForm.checkIn); const days = Number(this.bookingForm.daysCount); if (Number.isNaN(start.getTime()) || !Number.isInteger(days) || days < 1) return; start.setDate(start.getDate() + days); this.bookingForm.checkOut = this.localDateTime(start); }
  availableRooms() { const start = new Date(this.bookingForm.checkIn), end = new Date(this.bookingForm.checkOut); return this.rooms.filter(room => room.isActive && (!this.activeBooking(room) || String(room._id) === String(this.bookingForm.roomId))).filter(room => !this.bookings.some(b => String(b._id) !== String(this.editingBooking?._id) && String(b.roomId) === String(room._id) && ['RESERVED','CHECKED_IN','CHECKOUT_DUE'].includes(b.status) && new Date(b.checkIn) < end && new Date(b.checkOut) > start)); }
  bookingRoomOptions() { return this.availableRooms().map(room => ({ value: String(room._id), label: `${room.number} — ${room.name || `${room.capacity} kishilik`}` })); }
  addPaymentRow() { this.bookingForm.payments.push(this.blankPayment()); }
  removePaymentRow(index: number) { this.bookingForm.payments.splice(index, 1); }
  saveBooking() { const totalUZS = Number(this.bookingForm.agreedUZS ?? 0), totalUSD = Number(this.bookingForm.agreedUSD ?? 0); if (!this.bookingForm.roomId || !this.bookingForm.guestName.trim() || !Number.isInteger(Number(this.bookingForm.guestsCount)) || Number(this.bookingForm.guestsCount) < 1 || !Number.isInteger(Number(this.bookingForm.daysCount)) || Number(this.bookingForm.daysCount) < 1 || (!totalUZS && !totalUSD)) { this.toast.error('Xona, mehmon, mehmonlar soni, kunlar soni va kelishilgan summani kiriting.'); return; } if (this.editingBooking && !this.bookingForm.changeNote.trim()) { this.toast.error('Tahrirlash uchun izoh majburiy.'); return; } const invalidMinus = this.bookingForm.payments.some((p: Payment) => Number(p.amount) < 0 && !p.note.trim()); if (invalidMinus) { this.toast.error('Minus to\'lov uchun izoh majburiy.'); return; } this.updateCheckout(); const body = { ...this.bookingForm, guestsCount: Number(this.bookingForm.guestsCount), daysCount: Number(this.bookingForm.daysCount), agreedTotals: { UZS: totalUZS, USD: totalUSD }, payments: this.bookingForm.payments.filter((p: Payment) => Number(p.amount) !== 0) }; const request = this.editingBooking ? this.hotel.updateBooking(this.editingBooking._id, body) : this.hotel.createBooking(body); request.subscribe({ next: () => { this.bookingDialog=false; this.toast.success('Band qilish saqlandi'); this.load(); } }); }
  openPayment(booking: any) { this.editingBooking = booking; this.payment = this.blankPayment(); this.paymentDialog = true; }
  savePayment() { if (!this.editingBooking || !Number(this.payment.amount)) { this.toast.error('To\'lov summasini kiriting.'); return; } if (Number(this.payment.amount) < 0 && !this.payment.note.trim()) { this.toast.error('Minus to\'lov uchun izoh majburiy.'); return; } this.hotel.addPayment(this.editingBooking._id, this.payment).subscribe({ next: () => { this.paymentDialog = false; this.toast.success('To\'lov tarixi saqlandi'); this.load(); } }); }
  openRoom(room?: any) { this.editingRoom = room ?? null; this.roomForm = room ? { ...room, note: '' } : this.blankRoom(); this.roomDialog = true; }
  saveRoom() { if (!this.roomForm.number || Number(this.roomForm.capacity) < 1) { this.toast.error('Xona raqami va sig\'imini kiriting.'); return; } const request = this.editingRoom ? this.hotel.updateRoom(this.editingRoom._id, this.roomForm) : this.hotel.createRoom(this.roomForm); request.subscribe({ next: () => { this.roomDialog=false; this.toast.success('Xona saqlandi'); this.load(); } }); }
  archiveRoom(room: any) { if (!confirm(`${room.number} xonasini faolsizlantirasizmi? Eski tarix o‘chmaydi.`)) return; this.hotel.archiveRoom(room._id, { note: 'Xona faolsizlantirildi' }).subscribe({ next: () => { this.toast.success('Xona faolsizlantirildi'); this.load(); } }); }
  deleteBooking(booking: any) { const note = prompt('O‘chirish sababi (tarixda saqlanadi):')?.trim(); if (!note) return; if (!confirm('Band qilish ko‘rinmaydi, lekin admin tarixida saqlanadi. Davom etasizmi?')) return; this.hotel.deleteBooking(booking._id, { confirmation: 'DELETE', note }).subscribe({ next: () => { this.toast.success('Band qilish tarixga o‘tkazildi'); this.load(); } }); }
  paymentTotals(booking: any): Record<Currency,number> { return (booking.payments ?? []).reduce((o: any,p: any) => { o[p.currency === 'USD' ? 'USD' : 'UZS'] += Number(p.amount ?? 0); return o; }, { UZS: 0, USD: 0 }); }
}
