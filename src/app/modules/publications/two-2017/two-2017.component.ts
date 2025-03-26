import { Component } from '@angular/core';

@Component({
  selector: 'app-two-2017',
  standalone: false,
  templateUrl: './two-2017.component.html',
  styleUrl: './two-2017.component.scss'
})
export class Two2017Component {


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
