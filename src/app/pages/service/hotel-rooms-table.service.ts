import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { DefaultService } from '../../shared/services/default.service';

/** Hotel rooms API pagination qaytarmaydi; umumiy jadval uchun mos adapter. */
@Injectable()
export class HotelRoomsTableService extends DefaultService {
    formName = 'hotel-rooms-table';

    public constructor() {
        super();
    }

    getUrl(): string {
        return 'api/hotel/rooms';
    }

    override reloadTable() {
        return this.getAll().pipe(
            map((response: any) => {
                const params = this.tableRequest.getParams() as Record<string, unknown>;
                const normalize = (value: unknown) => String(value ?? '').trim().toLocaleLowerCase('uz');
                const search = normalize(params['search']);
                const number = normalize(params['number']);
                const name = normalize(params['name']);

                let filtered = (Array.isArray(response?.data) ? response.data : []).filter((room: any) => {
                    const matchesSearch = !search || [room.number, room.name].some((value) => normalize(value).includes(search));
                    const matchesNumber = !number || normalize(room.number).includes(number);
                    const matchesName = !name || normalize(room.name).includes(name);
                    return matchesSearch && matchesNumber && matchesName;
                });

                const total = filtered.length;
                const page = Math.max(1, Number(params['page']) || 1);
                const perPage = Math.max(1, Number(params['per_page']) || total || 15);
                const data = filtered.slice((page - 1) * perPage, page * perPage);
                return { ...response, data, pagination: { total } };
            })
        );
    }
}
