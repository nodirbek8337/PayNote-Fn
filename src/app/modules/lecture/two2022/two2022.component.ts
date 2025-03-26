import { Component } from '@angular/core';

@Component({
  selector: 'app-two2022',
  standalone: false,
  templateUrl: './two2022.component.html',
  styleUrl: './two2022.component.scss'
})
export class Two2022Component {



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
