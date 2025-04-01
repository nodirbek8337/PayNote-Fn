import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-useful-links',
  standalone: true,
  templateUrl: './useful-links.component.html',
  styleUrl: './useful-links.component.scss',
  imports: [NgFor, RouterModule]
})
export class UsefulLinksComponent {



}
