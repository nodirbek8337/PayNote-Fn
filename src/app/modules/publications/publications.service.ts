// publication.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PublicationService {
  constructor(private http: HttpClient) {}

  getPublicationsByYear(year: number) {
    console.log(year);
    
    // return this.http.get(`/api/publications?year=${year}`);
  }
}
