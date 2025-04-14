import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-lecture',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule, RouterLink],
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit {
  years: number[] = [];

  constructor() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2019; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    console.log(true);
  }
}
