import { Directive, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { DefaultService } from '../../../services/default.service';
import { injectViewUpdates } from '../../../utils/view-updates';

@Directive()
export abstract class TableFeatureBaseComponent implements OnInit {
    protected readonly viewUpdates = injectViewUpdates();
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    @Input() rows: number = 15;
    @Input() hasRowIndex: boolean = false;
    @Input() persistStateInUrl = false;

    value: any[] = [];
    totalRecords: number = 0;
    amountTotals: any = {};
    loading: boolean = false;
    columnFilters: { [key: string]: any } = {};
    editMode = false;
    editData: any = {};
    showEditDialog = false;

    currentPageStartIndex = 0;
    protected filterTimeout: any;
    protected dataLoadedOnce = false;
    private lastLoadSignature = '';
    private activeLoadSignature = '';
    private loadSequence = 0;

    abstract _defaultService: DefaultService;
    abstract columnDefs: any[];

    ngOnInit(): void {
        if (this.persistStateInUrl) this.restoreUrlState();
        if (!this.dataLoadedOnce && this._defaultService?.tableRequest) {
            this.dataLoadedOnce = true;
            if (this.hasRowIndex) this.addRowIndexColumn();
        }
    }

    reload(filters: any = {}) {
        const reloadEvent: TableLazyLoadEvent = {
            first: 0,
            rows: this.rows,
            filters
        };
        this.loadData(reloadEvent, true);
    }

    loadData(event: TableLazyLoadEvent, force = false) {
        const activeFilters = this.persistStateInUrl ? this.formatColumnFilters() : event.filters;
        const loadSignature = this.getLoadSignature({ ...event, filters: activeFilters });

        if (!force && (loadSignature === this.lastLoadSignature || loadSignature === this.activeLoadSignature)) {
            return;
        }

        const request = this._defaultService.tableRequest;
        this.rows = event.rows ?? this.rows;
        request.setPageParamsPrimeNg(event.first ?? 0, this.rows);
        this.currentPageStartIndex = event.first ?? 0;

        if (event.sortField && event.sortOrder !== null && event.sortOrder !== undefined) {
            const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
            const sortOrder = event.sortOrder ?? 1;
            request.setSortParamsPrimeNg({ field: sortField, order: sortOrder });
        }

        if (activeFilters) {
            request.setFilterParams(activeFilters);
        }
        if (this.persistStateInUrl) this.syncUrlState();

        this.loading = true;
        this.amountTotals = null;
        this.activeLoadSignature = loadSignature;
        const sequence = ++this.loadSequence;

        this._defaultService.reloadTable().pipe(this.viewUpdates()).subscribe({
            next: (res) => {
                if (sequence !== this.loadSequence) return;
                const items = Array.isArray(res.data) ? res.data : [];

                this.value = items.map((item: any, index: number) => ({
                    rowIndex: this.currentPageStartIndex + index + 1,
                    ...item
                }));

                this.totalRecords = res.pagination?.total ?? res.total ?? res.data?.total ?? 0;
                this.amountTotals = res.amount_totals;
                this.loading = false;
                this.lastLoadSignature = loadSignature;
                this.activeLoadSignature = '';
            },
            error: () => {
                if (sequence !== this.loadSequence) return;
                this.value = [];
                this.totalRecords = 0;
                this.amountTotals = null;
                this.loading = false;
                this.activeLoadSignature = '';
            }
        });
    }

    private getLoadSignature(event: TableLazyLoadEvent): string {
        return JSON.stringify({
            first: event.first ?? 0,
            rows: event.rows ?? this.rows,
            sortField: event.sortField ?? null,
            sortOrder: event.sortOrder ?? null,
            filters: event.filters ?? null
        });
    }

    onColumnFilter(value: any, field: string) {
        if ((typeof value === 'string' && value.trim() !== '') || (Array.isArray(value) && value.length > 0) || (typeof value === 'object' && value !== null) || typeof value === 'number' || typeof value === 'boolean') {
            this.columnFilters[field] = value;
        } else {
            delete this.columnFilters[field];
        }

        if (this.filterTimeout) clearTimeout(this.filterTimeout);

        this.filterTimeout = setTimeout(() => {
            this.applyFilters();
        }, 500);
    }

    protected formatColumnFilters(): Record<string, { value: unknown; matchMode: string }> {
        const formattedFilters: any = {};

        for (const key in this.columnFilters) {
            const value = this.columnFilters[key];

            if (typeof value === 'string' && value.trim() !== '') {
                formattedFilters[key] = { value, matchMode: 'contains' };
            } else if (typeof value === 'number' || typeof value === 'boolean') {
                formattedFilters[key] = { value, matchMode: 'equals' };
            } else if (Array.isArray(value) && value.length === 2 && value.some((item) => typeof item === 'number' && Number.isFinite(item))) {
                if (typeof value[0] === 'number' && Number.isFinite(value[0])) {
                    formattedFilters[`${key}_from`] = { value: value[0], matchMode: 'gte' };
                }
                if (typeof value[1] === 'number' && Number.isFinite(value[1])) {
                    formattedFilters[`${key}_to`] = { value: value[1], matchMode: 'lte' };
                }
            } else if (Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
                formattedFilters[`${key}_from`] = {
                    value: value[0].toISOString(),
                    matchMode: 'gte'
                };
                formattedFilters[`${key}_to`] = {
                    value: value[1].toISOString(),
                    matchMode: 'lte'
                };
            } else if (value) {
                formattedFilters[key] = { value, matchMode: 'contains' };
            }
        }

        return formattedFilters;
    }

    applyFilters() {
        this.reload(this.formatColumnFilters());
    }

    private restoreUrlState(): void {
        const params = this.route.snapshot.queryParamMap;
        const perPage = Number(params.get('per_page'));
        const page = Number(params.get('page'));
        if (Number.isInteger(perPage) && perPage > 0 && perPage <= 100) this.rows = perPage;
        if (Number.isInteger(page) && page > 1) this.currentPageStartIndex = (page - 1) * this.rows;

        const search = params.get('search');
        if (search) this.columnFilters['search'] = search;
        for (const column of this.columnDefs) {
            if (column.searchable === false) continue;
            if (column.filterType === 'date-range') {
                const from = params.get(`${column.field}_from`);
                const to = params.get(`${column.field}_to`);
                if (!from || !to) continue;
                const start = new Date(from);
                const end = new Date(to);
                if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) this.columnFilters[column.field] = [start, end];
            } else {
                const value = params.get(column.field);
                if (value) this.columnFilters[column.field] = value;
            }
        }
    }

    private syncUrlState(): void {
        const filters = this.formatColumnFilters();
        const managedKeys = new Set(['page', 'per_page', 'search']);
        for (const column of this.columnDefs) {
            if (column.searchable === false) continue;
            managedKeys.add(column.field);
            if (column.filterType === 'date-range') {
                managedKeys.add(`${column.field}_from`);
                managedKeys.add(`${column.field}_to`);
            }
        }
        const queryParams: Record<string, string | number | null> = {};
        for (const key of managedKeys) queryParams[key] = null;
        for (const [key, filter] of Object.entries(filters)) queryParams[key] = String(filter.value);
        queryParams['page'] = Math.floor(this.currentPageStartIndex / this.rows) + 1;
        queryParams['per_page'] = this.rows;
        const current = this.route.snapshot.queryParamMap;
        if ([...managedKeys].every(key => (current.get(key) ?? null) === (queryParams[key] === null ? null : String(queryParams[key])))) return;
        void this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge', replaceUrl: true });
    }

    isFilterEmpty(): boolean {
        return Object.keys(this.columnFilters).length === 0;
    }

    clearAllFilters() {
        if (this.filterTimeout) clearTimeout(this.filterTimeout);
        this.columnFilters = {};
        this.reload({});
    }

    protected addRowIndexColumn() {
        this.columnDefs.unshift({
            field: 'rowIndex',
            header: '#',
            sortable: false,
            searchable: false,
            style: { width: '60px', textAlign: 'center' }
        });
    }

    abstract triggerAdd(): void;
    abstract triggerEdit(row: any): void;
    abstract triggerDelete(row: any): void;
    abstract triggerRefresh(): void;
    abstract handleRowClick(event: any): void;
    abstract loadFormComponent(id?: any): void;
}
