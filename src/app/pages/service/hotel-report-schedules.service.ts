import { Injectable } from '@angular/core';
import { DefaultService } from '../../shared/services/default.service';

@Injectable({ providedIn: 'root' })
export class HotelReportSchedulesService extends DefaultService {
    override formName = 'hotel-report-schedules';

    override getUrl(): string { return 'api/hotel/report-schedules'; }
}
