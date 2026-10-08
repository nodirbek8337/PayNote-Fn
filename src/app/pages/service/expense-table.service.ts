import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable()
export class ExpenseTableService extends DefaultService {
  formName = 'expense-table';

  public constructor() {
    super();
  }

  getUrl(): string { return 'api/expenses'; }
}
