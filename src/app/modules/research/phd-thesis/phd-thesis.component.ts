import { Component } from '@angular/core';

@Component({
  selector: 'app-phd-thesis',
  standalone: false,
  templateUrl: './phd-thesis.component.html',
  styleUrl: './phd-thesis.component.scss'
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
