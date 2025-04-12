import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  ngOnInit(): void {
      
  }

  constructor() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2019; year--) {
      this.years.push(year);
    }
  }
}
