import { CommonModule } from '@angular/common';
import { injectViewUpdates } from '../../shared/utils/view-updates';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { EMPTY, Subscription, catchError, finalize, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonDirective } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputComponent } from '../../shared/components/input/input.component';
import { DateInputComponent } from '../../shared/components/date-input/date-input.component';
import { TimeInputComponent } from '../../shared/components/time-input/time-input.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { ICustomAction } from '../../shared/interfaces/custom-action.interface';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../shared/services/auth.service';
import { HotelService } from '../service/hotel.service';
import { HotelRoomsTableService } from '../service/hotel-rooms-table.service';
import { HotelHistoryTableService } from '../service/hotel-history-table.service';
import { UsersFilterComponent } from '../users/filter/users-filter.component';
import { CustomDateRendererComponent } from '../../shared/components/badge/custom-date-renderer.component';

type Currency = 'UZS' | 'USD';
type Payment = { amount: number | null; currency: Currency; method: string; note: string };

@Component({
  selector: 'app-hotel', standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonDirective, ConfirmDialog, PrimeDatatableComponent, InputComponent, DateInputComponent, TimeInputComponent, SelectComponent, TextareaComponent],
  providers: [HotelRoomsTableService, HotelHistoryTableService, ConfirmationService],
  templateUrl: './hotel.component.html', styleUrl: './hotel.component.scss',
})
export class HotelComponent implements OnInit, OnDestroy {
  private readonly viewUpdates = injectViewUpdates();
  private loadSubscription?: Subscription;
  private hotel = inject(HotelService); private toast = inject(ToastService); private auth = inject(AuthService); private route = inject(ActivatedRoute); private confirmation = inject(ConfirmationService);
  readonly roomTableService = inject(HotelRoomsTableService);
  readonly historyTableService = inject(HotelHistoryTableService);
  @ViewChild('roomsTable') private roomsTable?: PrimeDatatableComponent;
  @ViewChild('historyTable') private historyTable?: PrimeDatatableComponent;
  rooms: any[] = []; history: any[] = []; loading = false;
  bookingDialog = false; roomDialog = false; paymentDialog = false; section: 'bookings' | 'rooms' | 'history' = 'bookings';
  editingBooking: any | null = null; editingRoom: any | null = null;
  bookingSubmitted = false;
  deletingBooking: any | null = null;
  deleteReason = '';
  deleteBusy = false;
  savingBooking = false;
  private paymentSnapshot = '';
  private createdAtSnapshot = '';
  private checkInSnapshot = '';
  private checkOutSnapshot = '';
  paymentNoteRequired = false;
  private bookingSnapshot = '';
  readonly methods = [{ value: 'CASH', label: 'Naqd' }, { value: 'TERMINAL', label: 'Terminal' }, { value: 'CARD', label: 'Karta' }, { value: 'EXPEDIA', label: 'Expedia' }, { value: 'BOOKING', label: 'Booking' }];
  readonly currencies = [{ value: 'UZS', label: 'UZS' }, { value: 'USD', label: 'USD' }];
  bookingForm: any = this.blankBooking(); roomForm: any = this.blankRoom(); payment: Payment = this.blankPayment();
  bookingDate: Date | null = null;
  bookingTime = '';
  get isAdmin() { return this.auth.isAdmin(); }
  readonly reasonRequired = true;
  get canManageBookings() { return this.auth.canUseHotel(); }
  get canManageRooms() { return this.auth.isAdmin(); }
  get isRoomCatalog() { return this.section === 'rooms'; }
  get canSeeHistory() { return this.section === 'history'; }
  get loadingText() {
    return this.section === 'rooms'
      ? 'Xonalar yuklanmoqda...'
      : this.section === 'history'
        ? 'Hisob-kitob tarixi yuklanmoqda...'
        : 'Buyurtmalar yuklanmoqda...';
  }
  readonly roomColumnDefs = [
    { field: 'number', header: 'Xona raqami', widthClass: 'w-20p', sortable: false, searchable: false },
    { field: 'name', header: 'Turi', widthClass: 'w-25p', sortable: false, searchable: false },
    { field: 'capacity', header: 'Sig‘imi', widthClass: 'w-20p', sortable: false, searchable: false, cellRendererFn: (room: any) => `<span>${Number(room.capacity) || 0} kishi</span>` },
    { field: 'createdAt', header: 'Yaratilgan vaqt', widthClass: 'w-25p', sortable: false, searchable: false, cellRendererComponent: CustomDateRendererComponent },
  ];
  readonly roomFilterComponent = UsersFilterComponent;
  readonly historyFilterComponent = UsersFilterComponent;
  readonly roomActions: ICustomAction[] = [
    { icon: 'pi pi-pencil', tooltip: 'Xonani tahrirlash', color: 'secondary', action: (room) => this.openRoom(room) },
    { icon: 'pi pi-trash', tooltip: "Xonani o'chirish", color: 'danger', action: (room) => this.deleteRoom(room) },
  ];
  readonly historyColumnDefs = [
    { field: 'roomNumber', header: 'Xona', widthClass: 'w-15p', sortable: false, filterType: 'text', placeholder: 'Xona raqamini qidiring' },
    { field: 'guestsCount', header: 'Mehmonlar', widthClass: 'w-15p', sortable: false, searchable: false, cellRendererFn: (booking: any) => `${Number(booking.guestsCount) || 0} kishi` },
    { field: 'daysCount', header: 'Muddat', widthClass: 'w-15p', sortable: false, searchable: false, cellRendererFn: (booking: any) => `${Number(booking.daysCount) || 0} kun` },
    { field: 'total', header: 'Jami narx', widthClass: 'w-30p', sortable: false, searchable: false, cellRendererFn: (booking: any) => this.historyTotalText(booking) },
    { field: 'createdAt', header: 'Buyurtma vaqti', widthClass: 'w-25p', sortable: false, filterType: 'date-range', placeholder: 'Vaqt oraligini tanlang', cellRendererComponent: CustomDateRendererComponent },
  ];
  readonly historyActions: ICustomAction[] = [
    { icon: 'pi pi-pencil', tooltip: 'Buyurtmani tahrirlash', color: 'secondary', hidden: (booking) => !!booking.isDeleted, action: (booking) => this.openBooking(undefined, booking) },
    { icon: 'pi pi-trash', tooltip: 'Buyurtmani o‘chirish', color: 'danger', hidden: (booking) => !!booking.isDeleted, action: (booking) => this.confirmDeleteBooking(booking) },
  ];

  ngOnInit() {
    const section = this.route.snapshot.data['section'];
    this.section = section === 'rooms' ? 'rooms' : section === 'history' ? 'history' : 'bookings';
    if (!this.isRoomCatalog) this.load();
  }

  ngOnDestroy() { this.loadSubscription?.unsubscribe(); }
  private defaultDate(days = 0) { const d = new Date(); d.setDate(d.getDate() + days); d.setHours(12, 0, 0, 0); return this.localDateTime(d); }
  private localDateTime(d: Date) { const pad = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; }
  private blankPayment(): Payment { return { amount: null, currency: 'UZS', method: '', note: '' }; }
  private blankBooking() { return { roomNumber: '', guestsCount: 1, daysCount: 1, createdAt: this.localDateTime(new Date()), checkIn: this.defaultDate(), checkOut: this.defaultDate(1), agreedUZS: null, agreedUSD: null, paymentMethod: '', paymentNote: '', additionalPayments: [] as { method: string; UZS: number | null; USD: number | null }[], changeNote: '' }; }
  private blankRoom() { return { number: '', name: '', capacity: 1, note: '' }; }

  load() {
    if (this.isRoomCatalog) {
      this.roomsTable?.reload();
      return;
    }
    if (this.loading) return;
    this.loading = true;
    const request = this.section === 'rooms'
      ? this.hotel.rooms().pipe(tap(r => this.rooms = r.data ?? []))
      : this.section === 'history'
        ? this.hotel.history().pipe(tap(r => { this.history = r.data ?? []; this.historyTableService.setRows(this.history); this.historyTable?.reload(); }))
        : this.hotel.rooms().pipe(tap(r => this.rooms = r.data ?? []));

    this.loadSubscription = request.pipe(
      catchError(() => EMPTY),
      finalize(() => this.loading = false),
      this.viewUpdates()
    ).subscribe();
  }
  openBooking(room?: any, booking?: any) {
    this.editingBooking = booking ?? null;
    this.bookingSubmitted = false;
    this.bookingForm = booking ? { ...booking, guestsCount: Number(booking.guestsCount ?? 1), daysCount: Number(booking.daysCount ?? this.daysBetween(booking.checkIn, booking.checkOut)), roomNumber: String(booking.roomNumber), createdAt: this.localDateTime(new Date(booking.createdAt)), checkIn: this.localDateTime(new Date(booking.checkIn)), checkOut: this.localDateTime(new Date(booking.checkOut)), agreedUZS: Number(booking.agreedTotals?.UZS || 0) || null, agreedUSD: Number(booking.agreedTotals?.USD || 0) || null, paymentMethod: booking.payments?.[0]?.method ?? '', paymentNote: booking.payments?.[0]?.note ?? '', additionalPayments: [], changeNote: '' } : { ...this.blankBooking(), roomNumber: String(room?.number ?? '') };
    if (booking?.payments?.length) {
      const groups = new Map<string, { method: string; UZS: number; USD: number }>();
      for (const p of booking.payments) {
        const group = groups.get(p.method) ?? { method: p.method, UZS: 0, USD: 0 };
        group[p.currency === 'USD' ? 'USD' : 'UZS'] += Number(p.amount);
        groups.set(p.method, group);
      }
      const primary = groups.get(this.bookingForm.paymentMethod);
      if (primary) {
        primary.UZS -= Number(this.bookingForm.agreedUZS || 0);
        primary.USD -= Number(this.bookingForm.agreedUSD || 0);
      }
      this.bookingForm.additionalPayments = [...groups.values()].filter(p => p.UZS || p.USD);
    }
    if (!booking) this.updateCheckout();
    const bookingDateTime = new Date(this.bookingForm.createdAt);
    this.bookingDate = Number.isNaN(bookingDateTime.getTime()) ? null : bookingDateTime;
    this.bookingTime = this.bookingDate ? this.localDateTime(bookingDateTime).slice(11) : '';
    this.updatePaymentNoteRequirement();
    this.createdAtSnapshot = this.bookingForm.createdAt;
    this.checkInSnapshot = this.bookingForm.checkIn;
    this.checkOutSnapshot = this.bookingForm.checkOut;
    this.paymentSnapshot = this.paymentFingerprint();
    this.bookingSnapshot = this.bookingFingerprint(); this.bookingDialog = true;
    if (!this.rooms.length) this.hotel.rooms().pipe(this.viewUpdates()).subscribe({ next: response => this.rooms = response.data ?? [] });
  }
  private paymentFingerprint() {
    const b = this.bookingForm;
    return JSON.stringify([b.agreedUZS, b.agreedUSD, b.paymentMethod, b.paymentNote, b.additionalPayments]);
  }
  private bookingFingerprint() { return JSON.stringify(this.bookingForm); }
  private hasBookingChanges() { return this.bookingFingerprint() !== this.bookingSnapshot; }
  onBookingVisibleChange(visible: boolean) { if (visible) { this.bookingDialog = true; return; } this.requestCloseBooking(true); }
  requestCloseBooking(reopenAfterDialogDismiss = false) {
    if (!this.hasBookingChanges()) { this.bookingDialog = false; return; }
    if (reopenAfterDialogDismiss) {
      this.bookingDialog = false;
      setTimeout(() => { this.bookingDialog = true; });
    }
    this.confirmation.confirm({
      key: 'hotel-discard-booking',
      header: 'Kiritilgan ma’lumotlar o‘chib ketadi',
      message: 'Saqlanmagan o‘zgarishlar bor. Chiqsangiz, ular o‘chib ketadi. Davom etasizmi?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Chiqish',
      rejectLabel: 'Davom etish',
      acceptButtonStyleClass: 'confirm-accept-btn',
      rejectButtonStyleClass: 'p-button-outlined confirm-reject-btn',
      accept: () => { this.bookingDialog = false; this.bookingSubmitted = false; },
      reject: () => { this.bookingDialog = true; }
    });
  }
  private daysBetween(checkIn: string | Date, checkOut: string | Date) { return Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000)); }
  updateCheckout() { const start = new Date(this.bookingForm.checkIn); const days = Number(this.bookingForm.daysCount); if (Number.isNaN(start.getTime()) || !Number.isInteger(days) || days < 1) return; start.setDate(start.getDate() + days); this.bookingForm.checkOut = this.localDateTime(start); }
  syncBookingDateTime() {
    if (!this.bookingDate || Number.isNaN(this.bookingDate.getTime()) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(this.bookingTime)) {
      this.bookingForm.createdAt = '';
      return;
    }
    const date = new Date(this.bookingDate);
    const [hours, minutes] = this.bookingTime.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    this.bookingForm.createdAt = this.localDateTime(date);
  }
  availableRooms() { return this.rooms.filter(room => room.isActive); }
  bookingRoomOptions() {
    return this.rooms
      .filter(room => room.isActive || (this.editingBooking && String(room.number) === String(this.editingBooking.roomNumber)))
      .map(room => ({ value: String(room.number), label: `${room.number} — ${room.name || `${room.capacity} kishilik`}` }));
  }
  addAdditionalPayment() { this.bookingForm.additionalPayments.push({ method: '', UZS: null, USD: null }); this.updatePaymentNoteRequirement(); }
  removeAdditionalPayment(index: number) { this.bookingForm.additionalPayments.splice(index, 1); this.updatePaymentNoteRequirement(); }
  primaryAmountMissing() { return !Number(this.bookingForm.agreedUZS ?? 0) && !Number(this.bookingForm.agreedUSD ?? 0); }
  additionalAmountMissing(payment: { UZS: number | null; USD: number | null }) { return !Number(payment.UZS ?? 0) && !Number(payment.USD ?? 0); }
  isAdditionalPaymentInvalid(payment: { method: string; UZS: number | null; USD: number | null }) { return !payment.method || this.additionalAmountMissing(payment); }
  get bookingPaymentTotals() {
    const payments = [
      { UZS: this.bookingForm.agreedUZS, USD: this.bookingForm.agreedUSD },
      ...(this.bookingForm.additionalPayments ?? [])
    ];
    return payments.reduce((totals: { UZS: number; USD: number }, payment: { UZS?: number | null; USD?: number | null }) => {
      const uzs = Number(payment.UZS ?? 0); const usd = Number(payment.USD ?? 0);
      totals.UZS += Number.isFinite(uzs) ? uzs : 0;
      totals.USD += Number.isFinite(usd) ? usd : 0;
      return totals;
    }, { UZS: 0, USD: 0 });
  }
  updatePaymentNoteRequirement() {
    const values = [this.bookingForm.agreedUZS, this.bookingForm.agreedUSD, ...this.bookingForm.additionalPayments.flatMap((payment: { UZS: number | null; USD: number | null }) => [payment.UZS, payment.USD])];
    this.paymentNoteRequired = values.some((value) => Number(String(value ?? 0).replace(/[.\s]/g, '')) < 0);
  }
  get bookingNoteInvalid() { return this.bookingSubmitted && this.paymentNoteRequired && !this.bookingForm.paymentNote.trim(); }
  confirmRemoveAdditionalPayment(index: number) {
    this.confirmation.confirm({
      key: 'hotel-additional-payment',
      header: "Qo‘shimcha narxni o‘chirish",
      message: 'Bu qo‘shimcha narx qatori o‘chiriladi. Davom etasizmi?',
      icon: 'pi pi-trash',
      acceptLabel: 'O‘chirish',
      rejectLabel: 'Bekor qilish',
      acceptButtonStyleClass: 'confirm-accept-btn',
      rejectButtonStyleClass: 'p-button-outlined confirm-reject-btn',
      accept: () => this.removeAdditionalPayment(index)
    });
  }
  saveBooking() {
    if (this.savingBooking) return;
    this.bookingSubmitted = true;
    this.updatePaymentNoteRequirement();
    const totalUZS = Number(this.bookingForm.agreedUZS ?? 0);
    const totalUSD = Number(this.bookingForm.agreedUSD ?? 0);
    const hasInvalidAdditionalPayment = this.bookingForm.additionalPayments.some((payment: { method: string; UZS: number | null; USD: number | null }) => this.isAdditionalPaymentInvalid(payment));
    const additionalPayments = this.bookingForm.additionalPayments.flatMap((payment: { method: string; UZS: number | null; USD: number | null }) => [
      { amount: Number(payment.UZS ?? 0), currency: 'UZS' as Currency, method: payment.method, note: this.bookingForm.paymentNote },
      { amount: Number(payment.USD ?? 0), currency: 'USD' as Currency, method: payment.method, note: this.bookingForm.paymentNote }
    ]).filter((payment: Payment) => payment.amount !== 0);
    const hasMinus = totalUZS < 0 || totalUSD < 0 || additionalPayments.some((payment: Payment) => Number(payment.amount) < 0);

    if (!this.bookingForm.roomNumber || !Number.isInteger(Number(this.bookingForm.guestsCount)) || Number(this.bookingForm.guestsCount) < 1 || !Number.isInteger(Number(this.bookingForm.daysCount)) || Number(this.bookingForm.daysCount) < 1) {
      this.toast.error('Xona va buyurtma ma’lumotlarini kiriting.');
      return;
    }
    if (!this.bookingForm.createdAt || Number.isNaN(new Date(this.bookingForm.createdAt).getTime())) {
      this.toast.error('Buyurtma sanasi va vaqtini kiriting.');
      return;
    }
    if (!this.bookingForm.paymentMethod || (!totalUZS && !totalUSD)) {
      this.toast.error('To‘lov turini tanlang va UZS yoki USD narxidan kamida bittasini kiriting.');
      return;
    }
    if (hasInvalidAdditionalPayment) {
      this.toast.error('Har bir qo‘shimcha narx uchun to‘lov turi va UZS yoki USD narxidan kamida bittasini kiriting.');
      return;
    }
    if (hasMinus && !this.bookingForm.paymentNote.trim()) {
      this.toast.error("Minus to'lov uchun izoh majburiy.");
      return;
    }
    if (this.editingBooking && this.reasonRequired && !this.bookingForm.changeNote.trim()) {
      this.toast.error('O‘zgartirish sababini yozing.');
      return;
    }

    this.confirmation.confirm({
      key: 'hotel-save-booking',
      header: this.editingBooking ? 'O‘zgarishlarni tasdiqlash' : 'Buyurtmani tasdiqlash',
      message: this.editingBooking ? 'Kiritilgan o‘zgarishlar to‘g‘riligini qayta tekshiring. Saqlaysizmi?' : 'Kiritilgan buyurtma ma’lumotlari to‘g‘rimi? Saqlashdan oldin qayta tekshiring.',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Tasdiqlash',
      rejectLabel: 'Qayta tekshirish',
      acceptButtonStyleClass: 'confirm-accept-btn',
      rejectButtonStyleClass: 'p-button-outlined confirm-reject-btn',
      accept: () => this.persistBooking()
    });
  }

  private persistBooking() {
    if (this.savingBooking) return;
    const totalUZS = Number(this.bookingForm.agreedUZS ?? 0);
    const totalUSD = Number(this.bookingForm.agreedUSD ?? 0);
    const additionalPayments = this.bookingForm.additionalPayments.flatMap((payment: { method: string; UZS: number | null; USD: number | null }) => [
      { amount: Number(payment.UZS ?? 0), currency: 'UZS' as Currency, method: payment.method, note: this.bookingForm.paymentNote },
      { amount: Number(payment.USD ?? 0), currency: 'USD' as Currency, method: payment.method, note: this.bookingForm.paymentNote }
    ]).filter((payment: Payment) => payment.amount !== 0);
    const payments: Payment[] = [
      { amount: totalUZS, currency: 'UZS' as Currency, method: this.bookingForm.paymentMethod, note: this.bookingForm.paymentNote },
      { amount: totalUSD, currency: 'USD' as Currency, method: this.bookingForm.paymentMethod, note: this.bookingForm.paymentNote },
      ...additionalPayments
    ].filter((payment) => Number(payment.amount) !== 0);
    const bookingData = { ...this.bookingForm };
    delete bookingData.status;
    const body: any = { ...bookingData, createdAt: new Date(this.bookingForm.createdAt).toISOString(), checkIn: new Date(this.bookingForm.checkIn).toISOString(), checkOut: new Date(this.bookingForm.checkOut).toISOString(), guestsCount: Number(this.bookingForm.guestsCount), daysCount: Number(this.bookingForm.daysCount), agreedTotals: { UZS: totalUZS, USD: totalUSD }, payments, additionalPayments };
    if (this.editingBooking && this.bookingForm.createdAt === this.createdAtSnapshot) delete body.createdAt;
    if (this.editingBooking && this.bookingForm.checkIn === this.checkInSnapshot) delete body.checkIn;
    if (this.editingBooking && this.bookingForm.checkOut === this.checkOutSnapshot) delete body.checkOut;
    if (this.editingBooking && this.paymentFingerprint() === this.paymentSnapshot) {
      delete body.payments;
      delete body.additionalPayments;
    }
    const request = this.editingBooking ? this.hotel.updateBooking(this.editingBooking._id, body) : this.hotel.createBooking(body);
    this.savingBooking = true;
    request.pipe(finalize(() => this.savingBooking = false), this.viewUpdates()).subscribe({ next: (response) => {
      this.bookingSnapshot = this.bookingFingerprint(); this.bookingSubmitted = false; this.bookingDialog = false;
      if (response.warning) this.toast.warn(response.warning);
      else this.toast.success('Buyurtma tarixga saqlandi');
      this.load();
    } });
  }
  openPayment(booking: any) { this.editingBooking = booking; this.payment = this.blankPayment(); this.paymentDialog = true; }
  savePayment() { if (!this.editingBooking || !this.payment.method || !Number(this.payment.amount)) { this.toast.error('To‘lov turini tanlang va narxni kiriting.'); return; } if (Number(this.payment.amount) < 0 && !this.payment.note.trim()) { this.toast.error('Minus to‘lov uchun izoh majburiy.'); return; } this.hotel.addPayment(this.editingBooking._id, this.payment).pipe(this.viewUpdates()).subscribe({ next: () => { this.paymentDialog = false; this.toast.success('To‘lov tarixi saqlandi'); this.load(); } }); }
  openRoom(room?: any) { this.editingRoom = room ?? null; this.roomForm = room ? { ...room, note: '' } : this.blankRoom(); this.roomDialog = true; }
  saveRoom() { if (!this.roomForm.number || Number(this.roomForm.capacity) < 1) { this.toast.error('Xona raqami va sig\'imini kiriting.'); return; } const request = this.editingRoom ? this.hotel.updateRoom(this.editingRoom._id, this.roomForm) : this.hotel.createRoom(this.roomForm); request.pipe(this.viewUpdates()).subscribe({ next: () => { this.roomDialog=false; this.toast.success('Xona saqlandi'); this.load(); } }); }
  deleteRoom(room: any) { if (!confirm(`${room.number} xonasini butunlay o‘chirasizmi? Bu amalni qaytarib bo‘lmaydi.`)) return; this.hotel.deleteRoom(room._id).pipe(this.viewUpdates()).subscribe({ next: () => { this.toast.success("Xona o'chirildi"); this.load(); } }); }
  confirmDeleteBooking(booking: any) {
    this.deletingBooking = booking;
    this.deleteReason = '';
  }
  deleteBookingWithReason() {
    if (!this.deletingBooking || this.deleteBusy || (this.reasonRequired && !this.deleteReason.trim())) return;
    this.deleteBusy = true;
    this.hotel.deleteBooking(this.deletingBooking._id, { confirmation: 'DELETE', note: this.deleteReason.trim() })
      .pipe(finalize(() => this.deleteBusy = false), this.viewUpdates()).subscribe({ next: (response) => {
        this.deletingBooking = null;
        if (response.warning) this.toast.warn(response.warning, 'Telegram xabarlari', 'global', 8000);
        else this.toast.success('Buyurtma o‘chirildi');
        this.load();
      } });
  }
  historyTotalText(booking: any) {
    const total = this.paymentTotals(booking);
    const uzs = Math.round(total.UZS).toLocaleString('uz-UZ');
    const usd = Number(total.USD).toLocaleString('en-US', { maximumFractionDigits: 2 });
    return `UZS ${uzs} · USD ${usd}`;
  }
  bookingAgreedTotals(booking: any): Record<Currency,number> {
    return { UZS: Number(booking.agreedTotals?.UZS ?? 0), USD: Number(booking.agreedTotals?.USD ?? 0) };
  }
  paymentTotals(booking: any): Record<Currency,number> {
    const payments = booking.payments ?? [];
    if (!payments.length) return this.bookingAgreedTotals(booking);
    return payments.reduce((o: any,p: any) => { o[p.currency === 'USD' ? 'USD' : 'UZS'] += Number(p.amount ?? 0); return o; }, { UZS: 0, USD: 0 });
  }
  bookingAdditionalTotals(booking: any): Record<Currency,number> {
    const total = this.paymentTotals(booking); const agreed = this.bookingAgreedTotals(booking);
    return { UZS: total.UZS - agreed.UZS, USD: total.USD - agreed.USD };
  }
}
