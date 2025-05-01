import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  imports: [CommonModule, NgFor, TranslateModule],
})
export class HomepageComponent {
  features = [
    { title: 'HOMEPAGE.CLOUD', link: '', icon: 'fa-solid fa-cloud' },
    {
      title: 'HOMEPAGE.CONTEXT',
      link: '',
      icon: 'fa-solid fa-map-location-dot',
    },
    { title: 'HOMEPAGE.KNOWLADGE', link: '', icon: 'fa-solid fa-gear' },
    {
      title: 'HOMEPAGE.USER',
      link: '',
      icon: 'fa-solid fa-desktop',
    },
    { title: 'HOMEPAGE.HEALTH', link: '', icon: 'fa-regular fa-heart' },
  ];
}
