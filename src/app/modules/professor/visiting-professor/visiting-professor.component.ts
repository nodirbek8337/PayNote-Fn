import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../core/components/button/button.component';
import { InputComponent } from '../../../core/components/input/input.component';
import { ModalComponent } from '../../../core/components/modal/modal.component';
import { NgFor } from '@angular/common';
import { GeneralProfessorComponent } from '../components/general-professor/general-professor.component';

@Component({
  selector: 'app-visiting-professor',
  standalone: true,
  templateUrl: './visiting-professor.component.html',
  styleUrl: './visiting-professor.component.scss',
  imports: [
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    NgFor
  ]
})
export class VisitingProfessorComponent extends GeneralProfessorComponent {
  override professorType = 'visiting'; 
}
