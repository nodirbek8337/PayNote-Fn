import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gov-institutes',
  standalone: true,
  templateUrl: './gov-institutes.component.html',
  styleUrl: './gov-institutes.component.scss',
  imports: [NgFor, RouterModule]
})
export class GovInstitutesComponent {


}
