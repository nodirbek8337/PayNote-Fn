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

  Thesis: string = '../assets/pdf/Amaliy_ish_3.pdf';
  Presentation:string = '../assets/pdf/Amaliy_ish_5.pdf'
  professors = [
    {
      No: '48',
      Title: 'Semantic Sequence Contraction and Expansion for Data Interoperability',
      Name: 'Fahad Ahmed Satti',
      Date: 'Feb. 2023',
      Thesis: this.Thesis,
      Presentation: this.Presentation,
    },
  ]
}
