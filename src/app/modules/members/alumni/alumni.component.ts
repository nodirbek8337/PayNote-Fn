import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alumni',
  standalone: true,
  templateUrl: './alumni.component.html',
  styleUrl: './alumni.component.scss',
  imports: [NgFor, RouterModule]
})
export class AlumniComponent {

  professors = [
    {
      nameRole: 'Bold Chinguun - 1st',
      image: './assets/img/9.jpg',
      nationality: 'Ecuador',
      year: '2024',
        workMail: 'jake0011@gmail.com',
        major:'Security and Privacy'
    },
  ]
}
