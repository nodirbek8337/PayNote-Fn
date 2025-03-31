import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gov-institutes',
  standalone: true,
  templateUrl: './gov-institutes.component.html',
  styleUrl: './gov-institutes.component.scss',
  imports: [NgFor, RouterModule]
})
export class GovInstitutesComponent {



  professors = [
    {
      theme: '[Introduction to Research]',
      nameRole: 'Bold Chinguun - 1st',
      image: './assets/img/9.jpg',
      nationality: 'Ecuador',
      year: '2024',
        workMail: 'jake0011@gmail.com',
        major:'Security and Privacy'
    },
  ]
}
