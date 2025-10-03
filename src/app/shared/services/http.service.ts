import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class HttpService {
  _http = inject(HttpClient);
  baseUrl: string = environment.apiUrl;


  getAll(url: string, params: any = {}): Observable<any> {
    return this._http.get(this.baseUrl + url, {params});
  }

  getOne(url: string, id: any, params: any = {}): Observable<any> {
    return this._http.get<any>(this.baseUrl + url + '/' + id, {params});
  }

  post(url: string, form: any): Observable<any> {
    return this._http.post(this.baseUrl + url, form);
  }

  delete(url: string, id: any, params: any = {}): Observable<any> {
    return this._http.delete(this.baseUrl + url + '/' + id, {params});
  }

  put(url: string, form: any, id: any): Observable<any> {
    return this._http.put(this.baseUrl + url + '/' + id, form);
  }

  patch(url: string, form: any, id: any): Observable<any> {
    return this._http.patch(this.baseUrl + url + '/' + id, form);
  }
}
