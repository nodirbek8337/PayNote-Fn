import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
  imports:[
    NgFor,
    RouterModule,
  ]
})
export class PublicationsComponent implements OnInit {
  years: number[] = [];
  test2020 = {
    id:1,
    text: "Lorem ipsum 2020"
  };
  test2022 = {
    id:2,
    text: "Lorem ipsum 2022"
  };
  data:any;

  constructor(
    private readonly activatedRoute:ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((val:Params) => {
      const id = val['id'];
      switch(id){
        case "2020":
          this.data = this.test2020;
          break;
        case "2022":
          this.data = this.test2022;
          break;
        default:
          this.data = {
            id:0,
            text:"No DATA!!!"
          }
      }
    })
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2019; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
      
  }

}
