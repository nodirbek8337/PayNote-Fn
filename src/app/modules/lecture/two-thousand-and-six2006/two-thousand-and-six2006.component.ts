import { Component } from '@angular/core';

@Component({
  selector: 'app-two-thousand-and-six2006',
  standalone: false,
  templateUrl: './two-thousand-and-six2006.component.html',
  styleUrl: './two-thousand-and-six2006.component.scss'
})
export class TwoThousandAndSix2006Component {


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
