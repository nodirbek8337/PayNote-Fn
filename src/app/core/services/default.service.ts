import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { jsonToFormData } from '../utils/object.utils';
import { FormType } from '../enums/Form.enum';

@Injectable({
  providedIn: 'root',
})
export abstract class DefaultService {
  protected _http = inject(HttpClient);
  protected baseUrl: string = environment.apiUrl;
  protected formType: FormType = FormType.JSON;

  abstract getUrl(): string;

  getAll(params: any = {}): Observable<any> {
    return this._http.get(this.getFullUrl(), { params });
  }

  getOne(id: any, params: any = {}): Observable<any> {
    return this._http.get(`${this.getFullUrl()}/${id}`, { params });
  }

  insert(form: any): Observable<any> {
    return this._http.post(
      this.getFullUrl(),
      this.formType === FormType.FORM_DATA ? jsonToFormData(form) : form
    );
  }

  update(id: any, form: any): Observable<any> {
    return this._http.put(
      `${this.getFullUrl()}/${id}`,
      this.formType === FormType.FORM_DATA ? jsonToFormData(form) : form
    );
  }

  delete(id: any): Observable<any> {
    return this._http.delete(`${this.getFullUrl()}/${id}`);
  }

  private getFullUrl(): string {
    return this.baseUrl + '/' + this.getUrl();
  }
}
