import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, ViewChild, inject } from '@angular/core';

@Component({
    selector: 'datepicker-range',
    standalone: true,
    templateUrl: './datepicker-range.component.html',
    styleUrl: './datepicker-range.component.scss'
})
export class DatepickerRangeComponent implements OnChanges, AfterViewInit, OnDestroy {
    private readonly host = inject(ElementRef<HTMLElement>);
    @ViewChild('panel') panelRef!: ElementRef<HTMLElement>;

    @Input() value: Date[] | null = null;
    @Output() valueChange = new EventEmitter<Date[] | null>();
    @Input() placeholder = 'Vaqt oralig‘ini tanlang';
    @Input() baseZIndex = 2000;

    readonly months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    readonly weekdays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
    startDate: Date | null = null;
    endDate: Date | null = null;
    viewMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    open = false;
    isPortaled = false;
    private panelPlaceholder?: Comment;
    private originalPanelParent?: Node;

    ngOnChanges() {
        this.startDate = this.validDate(this.value?.[0]);
        this.endDate = this.validDate(this.value?.[1]);
        const current = this.startDate ?? new Date();
        this.viewMonth = new Date(current.getFullYear(), current.getMonth(), 1);
    }

    ngAfterViewInit(): void { this.originalPanelParent = this.panelRef.nativeElement.parentNode ?? undefined; }
    ngOnDestroy(): void { this.restorePanel(); }

    get displayValue(): string {
        if (!this.startDate || !this.endDate) return this.placeholder;
        return `${this.formatDate(this.startDate)} — ${this.formatDate(this.endDate)}`;
    }

    get selectionHint(): string {
        return this.startDate && !this.endDate ? 'Tugash sanasini tanlang' : 'Boshlanish sanasini tanlang';
    }

    get days(): Date[] {
        const first = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth(), 1);
        const offset = (first.getDay() + 6) % 7;
        const count = Math.ceil((offset + new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()) / 7) * 7;
        return Array.from({ length: count }, (_, index) => new Date(first.getFullYear(), first.getMonth(), index - offset + 1));
    }

    toggle(): void {
        if (this.open) this.close();
        else {
            const current = this.startDate ?? new Date();
            this.viewMonth = new Date(current.getFullYear(), current.getMonth(), 1);
            this.open = true;
            this.movePanelToOverlay();
            requestAnimationFrame(() => this.positionPanel());
        }
    }

    changeMonth(offset: number): void {
        this.viewMonth = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + offset, 1);
        requestAnimationFrame(() => this.positionPanel());
    }

    select(day: Date): void {
        if (!this.startDate || this.endDate) {
            this.startDate = this.startOfDay(day);
            this.endDate = null;
            return;
        }

        const selected = this.startOfDay(day);
        if (selected < this.startDate) {
            this.endDate = this.endOfDay(this.startDate);
            this.startDate = selected;
        } else {
            this.endDate = this.endOfDay(selected);
        }
        this.value = [this.startDate, this.endDate];
        this.valueChange.emit(this.value);
        this.close();
    }

    clear(event?: Event): void {
        event?.stopPropagation();
        this.startDate = null;
        this.endDate = null;
        this.value = null;
        this.valueChange.emit(null);
        this.close();
    }

    selectToday(): void { this.select(new Date()); }
    isToday(day: Date): boolean { return this.sameDay(day, new Date()); }
    isRangeStart(day: Date): boolean { return this.sameDay(day, this.startDate); }
    isRangeEnd(day: Date): boolean { return this.sameDay(day, this.endDate); }
    isInRange(day: Date): boolean { return !!this.startDate && !!this.endDate && day > this.startDate && day < this.endDate; }
    close(): void { this.open = false; this.restorePanel(); }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as Node;
        if (!this.host.nativeElement.contains(target) && !this.panelRef?.nativeElement.contains(target)) this.close();
    }

    @HostListener('document:keydown.escape')
    onEscape(): void { this.close(); }

    @HostListener('window:resize')
    @HostListener('window:scroll')
    onViewportChange(): void { if (this.open) this.positionPanel(); }

    private validDate(value: Date | undefined): Date | null {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    private formatDate(value: Date): string {
        const pad = (part: number) => String(part).padStart(2, '0');
        return `${pad(value.getDate())}.${pad(value.getMonth() + 1)}.${value.getFullYear()}`;
    }

    private sameDay(a: Date, b: Date | null): boolean {
        return !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    private startOfDay(value: Date): Date {
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    private endOfDay(value: Date): Date {
        const date = new Date(value);
        date.setHours(23, 59, 59, 999);
        return date;
    }

    private movePanelToOverlay(): void {
        const panel = this.panelRef?.nativeElement;
        if (!panel || this.isPortaled) return;
        this.originalPanelParent ??= panel.parentNode ?? undefined;
        if (!this.originalPanelParent) return;
        this.panelPlaceholder = document.createComment('datepicker-range-panel');
        this.originalPanelParent.insertBefore(this.panelPlaceholder, panel);
        document.body.appendChild(panel);
        panel.style.display = 'block';
        panel.style.position = 'fixed';
        panel.style.zIndex = String(this.baseZIndex);
        this.isPortaled = true;
    }

    private restorePanel(): void {
        const panel = this.panelRef?.nativeElement;
        if (!panel || !this.isPortaled || !this.originalPanelParent) return;
        this.originalPanelParent.insertBefore(panel, this.panelPlaceholder ?? null);
        this.panelPlaceholder?.remove();
        this.panelPlaceholder = undefined;
        this.isPortaled = false;
        for (const property of ['top', 'left', 'right', 'max-height', 'display', 'position', 'z-index']) panel.style.removeProperty(property);
    }

    private positionPanel(): void {
        const panel = this.panelRef?.nativeElement;
        const trigger = this.host.nativeElement.querySelector('.datepicker-range__trigger') as HTMLElement | null;
        if (!panel || !trigger || !this.isPortaled) return;
        const triggerRect = trigger.getBoundingClientRect();
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        const gap = 8;
        const availableBelow = window.innerHeight - triggerRect.bottom - gap;
        const openBelow = availableBelow >= panelHeight || triggerRect.top < panelHeight + gap;
        panel.style.top = `${openBelow ? triggerRect.bottom + gap : Math.max(gap, triggerRect.top - panelHeight - gap)}px`;
        panel.style.left = `${Math.max(gap, Math.min(triggerRect.left, window.innerWidth - panelWidth - gap))}px`;
        panel.style.maxHeight = `${Math.max(180, openBelow ? availableBelow : triggerRect.top - gap)}px`;
    }
}
