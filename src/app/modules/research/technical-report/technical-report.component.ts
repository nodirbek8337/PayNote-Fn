import { Component } from '@angular/core';

@Component({
  selector: 'app-technical-report',
  standalone: false,
  templateUrl: './technical-report.component.html',
  styleUrl: './technical-report.component.scss'
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
