import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-past-projects',
  standalone: true,
  templateUrl: './past-projects.component.html',
  styleUrl: './past-projects.component.scss',
  imports: [NgFor]
})
export class PastProjectsComponent {


  professors = [
    {
      theme: '[ Past projects]',
      nameRole: 'Bold Chinguun - 1st',
      image: './assets/img/9.jpg',
      nationality: 'Ecuador',
      year: '2024',
        workMail: 'jake0011@gmail.com',
        major:'Security and Privacy'
    },
  ]
}
