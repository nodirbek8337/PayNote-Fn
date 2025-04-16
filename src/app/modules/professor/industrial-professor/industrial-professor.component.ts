import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../core/components/button/button.component';
import { InputComponent } from '../../../core/components/input/input.component';
import { ModalComponent } from '../../../core/components/modal/modal.component';
import { NgFor, NgIf } from '@angular/common';
import { GeneralProfessorComponent } from '../components/general-professor/general-professor.component';

@Component({
  selector: 'app-industrial-professor',
  standalone: true,
  templateUrl: './industrial-professor.component.html',
  styleUrl: './industrial-professor.component.scss',
  imports: [
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    NgFor,
    NgIf
  ]
})
export class IndustrialProfessorComponent extends GeneralProfessorComponent {
  override professorType = 'industrial'; 
}
