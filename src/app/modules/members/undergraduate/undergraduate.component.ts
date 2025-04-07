import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../core/components/button/button.component';
import { InputComponent } from '../../../core/components/input/input.component';
import { ModalComponent } from '../../../core/components/modal/modal.component';
import { NgFor } from '@angular/common';
import { GeneralMemberComponent } from '../components/general-members/general-member.component';

@Component({
  selector: 'app-undergraduate',
  standalone: true,
  templateUrl: './undergraduate.component.html',
  styleUrl: './undergraduate.component.scss',
  imports: [
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    NgFor,
  ]
})
export class UndergraduateComponent extends GeneralMemberComponent {
  override academicStatus = 'undergraduate';
}
