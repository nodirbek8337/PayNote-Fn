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
  selector: 'app-alumni',
  standalone: true,
  templateUrl: './alumni.component.html',
  styleUrl: './alumni.component.scss',
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
export class AlumniComponent extends GeneralMemberComponent {
  override academicStatus = 'alumni';
}
