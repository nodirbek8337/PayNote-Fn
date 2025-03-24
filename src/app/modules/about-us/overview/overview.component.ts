import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {

  overviews:any = [];



  constructor(private http: HttpClient){

  }
  
  ngOnInit(): void {
    this.http.get("http://localhost:5000/api/overviews").subscribe({
      next:(res)=> {
        // console.log(res);
        this.overviews= res;
      }
    })
  }
  

 
}