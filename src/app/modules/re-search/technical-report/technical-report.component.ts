import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-technical-report',
  standalone: true,
  templateUrl: './technical-report.component.html',
  styleUrl: './technical-report.component.scss',
  imports: [NgFor, RouterModule]
})
export class TechnicalReportComponent {

  professors = [
    {
      theme: '[ Technical report]',
      nameRole: 'Bold Chinguun - 1st',
      image: './assets/img/9.jpg',
      nationality: 'Ecuador',
      year: '2024',
        workMail: 'jake0011@gmail.com',
        major:'Security and Privacy'
    },
  ]
}
