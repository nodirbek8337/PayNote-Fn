import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends DefaultService {
  override formName = 'contacts';

  override getUrl(): string {
    return 'api/contacts';
  }
}
