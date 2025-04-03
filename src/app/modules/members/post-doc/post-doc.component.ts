import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { ButtonComponent } from '../../../core/components/button/button.component';
import { InputComponent } from '../../../core/components/input/input.component';
import { ModalComponent } from '../../../core/components/modal/modal.component';
import { NgFor } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-post-doc',
  standalone: true,
  templateUrl: './post-doc.component.html',
  styleUrl: './post-doc.component.scss',
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
export class PostDocComponent implements OnInit {
  _http = inject(HttpClient);
  professorForm: FormGroup;

  modalShow: boolean = false;
  members: any[] = [];
  currentProfessor: any = null;

  constructor(public fb: FormBuilder, private loadingService: LoadingService) {
    this.professorForm = this.fb.group({
      fullName: [''],
      academicStatus: [''],
      nationality: [''],
      researchGroup: [''],
      year: [''],
      major: [''],
      email: [''],
      imageUrl: [''],
      researchAreas: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getProfessors();
  }

  getProfessors() {
    this.loadingService.setLoadingState(true);
    const params = new HttpParams().set('academicStatus', 'post-doc');
    this._http.get(`${environment.apiUrl}/members`, { params }).subscribe({
      next: (res: any) => {
        this.members = res;
      },
      complete: () => {
        this.loadingService.setLoadingState(false);
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      }
    });
  }

  openModal(member: any = null): void {
    this.currentProfessor = member;
    this.modalShow = true;

    this.professorForm.reset();
    this.clearFormArrays();
    if (member) {
      this.professorForm.patchValue({
        fullName: member.fullName,
        academicStatus: member.academicStatus,
        nationality: member.nationality,
        researchGroup: member.researchGroup,
        year: member.year,
        major: member.major,
        email: member.email,
        imageUrl: member.imageUrl,
      });

      member.researchAreas?.forEach((area: string) => {
        this.researchAreas.push(this.fb.control(area));
      });
    }
  }

  submitForm(): void {
    console.log(this.currentProfessor);
    
    if (this.currentProfessor) {
      this.updateProfessor(this.currentProfessor._id);
    } else {
      this.addProfessor();
    }
  }

  // Getter methods for form arrays
  get researchAreas() {
    return this.professorForm.get('researchAreas') as FormArray;
  }

  addItem(field: FormArray) {
    field.push(this.fb.control(''));
  }

  removeItem(field: FormArray, index: number) {
    field.removeAt(index);
  }

  clearFormArrays() {
    this.researchAreas.clear();
  }

  closeModal(): void {
    this.modalShow = false;
    this.professorForm.reset();
    this.clearFormArrays();
  }

  addProfessor(): void {
    this.loadingService.setLoadingState(true);
    const professorData = this.professorForm.value;
    this._http.post(`${environment.apiUrl}/members`, professorData).subscribe({
      next: () => {
        this.modalShow = false;
        this.getProfessors();
      },
      complete: () => {
        this.loadingService.setLoadingState(false);
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      }
    });
  }

  updateProfessor(_id: any): void {
    this.loadingService.setLoadingState(true);
    const professorData = this.professorForm.value;
    this._http.put(`${environment.apiUrl}/members/${_id}`, professorData).subscribe({
      next: () => {
        this.modalShow = false;
        this.getProfessors();
      },
      complete: () => {
        this.loadingService.setLoadingState(false);
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      }
    });
  }

  deleteProfessor(member: any): void {
    this.loadingService.setLoadingState(true);
    this._http.delete(`${environment.apiUrl}/members/${member._id}`).subscribe({
      next: () => {
        this.getProfessors();
      },
      complete: () => {
        this.loadingService.setLoadingState(false);
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      }
    });
  }
}
