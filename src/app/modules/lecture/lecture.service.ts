import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LectureService {
  constructor(private http: HttpClient) {}

  getLecturesByYear(year: number) {
    console.log(`Fetching lectures for year ${year}`);
    // return this.http.get(`/api/lectures?year=${year}`);
  }
}
