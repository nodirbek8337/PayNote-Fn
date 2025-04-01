import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-overview',
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  imports:[RouterModule, HttpClientModule]
})
export class OverviewComponent implements OnInit {
  _http = inject(HttpClient);

  overviews:any = [];
  
  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this._http.get(`${environment.apiUrl}/overviews`).subscribe({
      next: (res: any) => {
        this.overviews = [...res];
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
