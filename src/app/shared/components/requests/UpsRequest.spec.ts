import { UpsTableRequest } from './UpsRequest';

describe('UpsTableRequest', () => {
    it('keeps paging and sorting while replacing stale filters', () => {
        const request = new UpsTableRequest('/api/products', { order_column: 'createdAt', order_type: 'desc' });

        request.setPageParamsPrimeNg(30, 15);
        request.setFilterParams({ search: { value: 'chortoq', matchMode: 'contains' }, currency: { value: 'UZS' } });
        request.setFilterParams({ currency: { value: 'USD' } });

        expect(request.getParams()).toEqual({
            order_column: 'createdAt',
            order_type: 'desc',
            page: 3,
            per_page: 15,
            currency: 'USD'
        });
    });
});
