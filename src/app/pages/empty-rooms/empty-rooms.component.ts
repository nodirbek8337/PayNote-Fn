import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PrimeDatatableComponent } from '../../shared/components/datatable/prime-datatable.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { DateInputComponent } from '../../shared/components/date-input/date-input.component';
import { ICustomAction } from '../../shared/interfaces/custom-action.interface';
import { ToastService } from '../../shared/services/toast.service';
import { injectViewUpdates } from '../../shared/utils/view-updates';
import { EmptyRoomsService } from '../service/empty-rooms.service';
import { UsersFilterComponent } from '../users/filter/users-filter.component';

type EmptyRoomSnapshot = {
  _id: string;
  dateKey: string;
  roomCount?: number;
  roomNumbers?: string[];
  createdByUsername?: string;
  updatedByUsername: string;
  updatedAt: string;
};

@Component({
  selector: 'app-empty-rooms',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonDirective, DialogModule, PrimeDatatableComponent, InputComponent, DateInputComponent],
  templateUrl: './empty-rooms.component.html',
  styleUrl: './empty-rooms.component.scss'
})
export class EmptyRoomsComponent {
  readonly emptyRoomsService = inject(EmptyRoomsService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly viewUpdates = injectViewUpdates();
  @ViewChild('emptyRoomsTable') private emptyRoomsTable?: PrimeDatatableComponent;

  saving = false;
  formDialog = false;
  editingId: string | null = null;
  deletingRow: EmptyRoomSnapshot | null = null;
  deleteDialog = false;
  deleting = false;
  form = this.fb.group({
    roomCount: [null as number | null, [Validators.required, Validators.min(0), Validators.max(1000)]],
    date: [this.today(), [Validators.required]],
    changeNote: ['', [Validators.maxLength(500)]]
  });
  deleteForm = this.fb.group({
    note: ['', [Validators.required, Validators.maxLength(500)]]
  });

  readonly rowActions: ICustomAction[] = [
    { icon: 'pi pi-pencil', tooltip: 'Tahrirlash', color: 'secondary', action: row => this.openForm(row) },
    { icon: 'pi pi-trash', tooltip: "O'chirish", color: 'danger', action: row => this.openDelete(row) }
  ];
  readonly FilterComponent = UsersFilterComponent;
  readonly columnDefs = [
    { field: 'roomCount', header: 'Xonalar', widthClass: 'w-25p', sortable: false, searchable: false, cellRendererFn: (row: EmptyRoomSnapshot) => String(this.count(row)) },
    { field: 'createdByUsername', header: 'Yuborgan', widthClass: 'w-25p', sortable: false, searchable: false, cellRendererFn: (row: EmptyRoomSnapshot) => row.createdByUsername || row.updatedByUsername || '-' },
    { field: 'dateKey', header: 'Sana', widthClass: 'w-25p', sortable: false, searchable: false, cellRendererFn: (row: EmptyRoomSnapshot) => this.formatDate(row.dateKey) }
  ];

  save(): void {
    if (this.form.invalid || this.saving) { this.form.markAllAsTouched(); return; }
    const changeNote = this.form.value.changeNote?.trim() ?? '';
    if (this.editingId && !changeNote) { this.toast.error("O'zgartirish sababini kiriting"); return; }
    const body = { roomCount: Number(this.form.value.roomCount), dateKey: this.dateKey(this.form.value.date!), changeNote };
    const wasEditing = !!this.editingId;
    const request = this.editingId ? this.emptyRoomsService.update(body, this.editingId) : this.emptyRoomsService.insert(body);
    this.saving = true;
    request.pipe(this.viewUpdates()).subscribe({
      next: (response: any) => {
        if (response?.warning) this.toast.warn(response.warning, 'Telegram xabarlari', 'global', 8000);
        else this.toast.success(wasEditing ? "Bo'sh xonalar soni yangilandi" : "Bo'sh xonalar soni saqlandi va Telegramga yuborildi");
        this.saving = false;
        this.formDialog = false;
        this.reset();
        this.emptyRoomsTable?.reload();
      },
      error: () => this.saving = false
    });
  }

  openForm(row?: EmptyRoomSnapshot): void {
    this.editingId = row?._id ?? null;
    const values = {
      roomCount: row ? this.count(row) : null,
      date: row ? this.dateFromKey(row.dateKey) : this.today(),
      changeNote: ''
    };
    this.formDialog = true;
    setTimeout(() => this.form.reset(values));
  }

  openDelete(row: EmptyRoomSnapshot): void {
    this.deletingRow = row;
    this.deleteForm.reset({ note: '' });
    this.deleteDialog = true;
  }

  closeDelete(): void {
    if (this.deleting) return;
    this.deleteDialog = false;
    this.deletingRow = null;
  }

  remove(): void {
    if (!this.deletingRow || this.deleteForm.invalid || this.deleting) {
      this.deleteForm.markAllAsTouched();
      return;
    }
    this.deleting = true;
    this.emptyRoomsService.deleteWithReason(this.deletingRow._id, this.deleteForm.value.note!.trim()).pipe(this.viewUpdates()).subscribe({
      next: (response: any) => {
        if (response?.warning) this.toast.warn(response.warning, 'Telegram xabarlari', 'global', 8000);
        else this.toast.success("Yozuv o'chirildi va Telegramga xabar yuborildi");
        if (this.editingId === this.deletingRow?._id) this.reset();
        this.deleting = false;
        this.closeDelete();
        this.emptyRoomsTable?.reload();
      },
      error: () => this.deleting = false
    });
  }

  reset(): void {
    this.editingId = null;
    this.form.reset({ roomCount: null, date: this.today(), changeNote: '' });
  }

  count(row: EmptyRoomSnapshot): number { return Number(row.roomCount ?? row.roomNumbers?.length ?? 0); }
  formatDate(value: string): string { return value.split('-').reverse().join('.'); }
  private today(): Date { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()); }
  private dateKey(value: Date): string {
    const pad = (part: number) => String(part).padStart(2, '0');
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  }
  private dateFromKey(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
