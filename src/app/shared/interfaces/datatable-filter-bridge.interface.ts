export interface DatatableFilterBridge {
  columnDefs: any[];
  columnFilters: Record<string, any>;
  loading: boolean;
  onColumnFilter: (value: any, field: string) => void;
  clearAllFilters: () => void;
}
