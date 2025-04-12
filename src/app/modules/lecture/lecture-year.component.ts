import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lecture-year',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>{{ year }} yil uchun lektsiyalar</h2>
    </div>
  `,
})
export class LectureYearComponent implements OnInit {
  year: number = new Date().getFullYear();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const yearParam = params.get('year');
      this.year = yearParam ? +yearParam : this.year;
    });
  }
}
