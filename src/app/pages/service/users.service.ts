import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends DefaultService {
  override formName = 'users';

  getTelegramSettings() {
    return this._http.get<{ data: TelegramSettings }>(this.getTableUrl() + '/telegram-settings');
  }

  saveTelegramSettings(settings: Pick<TelegramSettings, 'mode' | 'testUserId'>) {
    return this._http.put<{ data: TelegramSettings }>(this.getTableUrl() + '/telegram-settings', settings);
  }

  override getUrl(): string {
    return 'api/users';
  }
}

export interface TelegramSettings {
  mode: 'live' | 'paused' | 'test';
  testUserId: string | null;
  users: Array<{ _id: string; username: string }>;
}
