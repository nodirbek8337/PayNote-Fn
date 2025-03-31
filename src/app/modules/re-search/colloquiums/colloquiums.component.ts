import { Component } from '@angular/core';

@Component({
  selector: 'app-colloquiums',
  standalone: false,
  templateUrl: './colloquiums.component.html',
  styleUrl: './colloquiums.component.scss'
})
export class ColloquiumsComponent {

  professors = [
    {
      theme: '[ colloquiums ]',
      nameRole: 'Bold Chinguun - 1st',
      image: './assets/img/9.jpg',
      nationality: 'Ecuador',
      year: '2024',
        workMail: 'jake0011@gmail.com',
        major:'Security and Privacy'
    },
  ]
}
