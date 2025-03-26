import { Component } from '@angular/core';

@Component({
  selector: 'app-until-2005',
  standalone: false,
  templateUrl: './until-2005.component.html',
  styleUrl: './until-2005.component.scss'
})
export class Until2005Component {


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
