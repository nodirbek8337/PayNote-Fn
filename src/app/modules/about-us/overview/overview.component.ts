import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-overview',
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  imports:[ RouterModule ]
})
export class OverviewComponent implements OnInit {

  overviews:any = [];



  constructor(private http: HttpClient){

  }
  
  ngOnInit(): void {
    this.http.get("https://backend-production-1b74.up.railway.app/api/overviews").subscribe({
      next:(res)=> {
        console.log(res);
        this.overviews= res;
      }
    })
  }
  

 
}