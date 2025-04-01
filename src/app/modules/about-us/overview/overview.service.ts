import { Injectable } from '@angular/core';
import { DefaultService } from '../../../core/services/default.service';

@Injectable({
  providedIn: 'root',
})
export class OverviewService extends DefaultService {
  getUrl(): string {
    return `overviews`;
  }
}
