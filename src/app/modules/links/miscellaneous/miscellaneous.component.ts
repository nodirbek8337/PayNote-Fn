import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-miscellaneous',
  standalone: true,
  templateUrl: './miscellaneous.component.html',
  styleUrl: './miscellaneous.component.scss',
  imports: [NgFor, RouterModule]
})
export class MiscellaneousComponent {


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
