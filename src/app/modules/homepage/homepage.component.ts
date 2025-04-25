import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  imports: [CommonModule, NgFor],
})
export class HomepageComponent {
  features = [
    { title: 'Cloud and Big Data', link: '', icon: 'fa-solid fa-cloud' },
    {
      title: 'Context Awareness',
      link: '',
      icon: 'fa-solid fa-map-location-dot',
    },
    { title: 'Knowledge Engineering', link: '', icon: 'fa-solid fa-gear' },
    {
      title: 'User Interface/User Experience',
      link: '',
      icon: 'fa-solid fa-desktop',
    },
    { title: 'Health Informatics', link: '', icon: 'fa-regular fa-heart' },
  ];
}
