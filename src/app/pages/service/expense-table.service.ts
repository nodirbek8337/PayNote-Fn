import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable()
export class ExpenseTableService extends DefaultService {
  formName = 'expense-table';

  public constructor() {
    super();
  }

  getUrl(): string { return 'api/expenses'; }

  updateExpense(id: string, body: unknown) {
    return this._http.put<any>(`${this.getTableUrl()}/${id}`, body);
  }

  deleteExpense(id: string, body: unknown) {
    return this._http.delete<any>(`${this.getTableUrl()}/${id}`, { body });
  }
}
