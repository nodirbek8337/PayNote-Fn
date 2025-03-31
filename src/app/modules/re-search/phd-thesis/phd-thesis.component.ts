import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-phd-thesis',
  standalone: true,
  templateUrl: './phd-thesis.component.html',
  styleUrl: './phd-thesis.component.scss',
  imports: [NgFor]
})
export class PhdThesisComponent {


  professors = [
    {
      theme: '[ phd to Research]',
      nameRole: 'Bold Chinguun - 1st',
      image: './assets/img/9.jpg',
      nationality: 'Ecuador',
      year: '2024',
        workMail: 'jake0011@gmail.com',
        major:'Security and Privacy'
    },
  ]
}
