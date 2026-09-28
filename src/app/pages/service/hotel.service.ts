import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/hotel`;
  rooms() { return this.http.get<any>(`${this.url}/rooms`); }
  bookings(from: string, to: string) { return this.http.get<any>(`${this.url}/bookings`, { params: { from, to } }); }
  createRoom(body: any) { return this.http.post<any>(`${this.url}/rooms`, body); }
  updateRoom(id: string, body: any) { return this.http.put<any>(`${this.url}/rooms/${id}`, body); }
  archiveRoom(id: string, body: any) { return this.http.patch<any>(`${this.url}/rooms/${id}/archive`, body); }
  createBooking(body: any) { return this.http.post<any>(`${this.url}/bookings`, body); }
  updateBooking(id: string, body: any) { return this.http.put<any>(`${this.url}/bookings/${id}`, body); }
  addPayment(id: string, body: any) { return this.http.post<any>(`${this.url}/bookings/${id}/payments`, body); }
  summary() { return this.http.get<any>(`${this.url}/me/summary`); }
  history() { return this.http.get<any>(`${this.url}/history`); }
  deleteBooking(id: string, body: any) { return this.http.delete<any>(`${this.url}/bookings/${id}`, { body }); }
}
