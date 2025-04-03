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
  selector: 'app-collaboration-professor',
  standalone: true,
  templateUrl: './collaboration-professor.component.html',
  styleUrl: './collaboration-professor.component.scss',
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
export class CollaborationProfessorComponent implements OnInit{
  _http = inject(HttpClient);
  professorForm: FormGroup;

  modalShow: boolean = false;
  professors: any[] = [];
  currentProfessor: any = null;

  constructor(public fb: FormBuilder, private loadingService: LoadingService) {
    this.professorForm = this.fb.group({
      fullName: [''],
      type: [''],
      position: [''],
      department: [''],
      university: [''],
      nationality: [''],
      researchGroup: [''],
      website: [''],
      imageUrl: [''],
      contact: this.fb.group({
        email: [''],
        officePhone: [''],
        cellPhone: [''],
        officeFax: [''],
        period: ['']
      }),
      researchAreas: this.fb.array([]),
      education: this.fb.array([]),
      career: this.fb.array([]),
      awards: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getProfessors();
  }

  getProfessors() {
    this.loadingService.setLoadingState(true);
    const params = new HttpParams().set('type', 'collaboration');
    this._http.get(`${environment.apiUrl}/professors`, { params }).subscribe({
      next: (res: any) => {
        this.professors = res;
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

  openModal(professor: any = null): void {
    this.currentProfessor = professor;
    this.modalShow = true;

    this.professorForm.reset();
    this.clearFormArrays();
    
    if (professor) {
      this.professorForm.patchValue({
        fullName: professor.fullName,
        type: professor.type,
        position: professor.position,
        department: professor.department,
        university: professor.university,
        nationality: professor.nationality,
        researchGroup: professor.researchGroup,
        website: professor.website,
        imageUrl: professor.imageUrl,
        contact: {
          email: professor.contact.email,
          officePhone: professor.contact.officePhone,
          cellPhone: professor.contact.cellPhone,
          officeFax: professor.contact.officeFax,
          period: professor.contact.period
        }
      });

      professor.researchAreas.forEach((area: string) => {
        this.researchAreas.push(this.fb.control(area));
      });

      professor.education?.forEach((edu: any) => {
        this.education.push(this.fb.group({
          year: [edu.year],
          university: [edu.university],
          major: [edu.major || ''],
          degree: [edu.degree || '']
        }));
      });
  
      professor.career?.forEach((career: any) => {
        this.career.push(this.fb.group({
          year: [career.year],
          position: [career.position],
          university: [career.university]
        }));
      });
  
      professor.awards?.forEach((award: any) => {
        this.awards.push(this.fb.group({
          year: [award.year],
          title: [award.title]
        }));
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

  get education() {
    return this.professorForm.get('education') as FormArray;
  }

  get career() {
    return this.professorForm.get('career') as FormArray;
  }

  get awards() {
    return this.professorForm.get('awards') as FormArray;
  }

  addEducation() {
    this.education.push(this.fb.group({
      year: [''],
      university: [''],
      major: [''],
      degree: ['']
    }));
  }
  
  addCareer() {
    this.career.push(this.fb.group({
      year: [''],
      position: [''],
      university: ['']
    }));
  }
  
  addAward() {
    this.awards.push(this.fb.group({
      year: [''],
      title: ['']
    }));
  }

  addItem(field: FormArray) {
    field.push(this.fb.control(''));
  }

  removeItem(field: FormArray, index: number) {
    field.removeAt(index);
  }

  clearFormArrays() {
    this.researchAreas.clear();
    this.education.clear();
    this.career.clear();
    this.awards.clear();
  }

  closeModal(): void {
    this.modalShow = false;
    this.professorForm.reset();
    this.clearFormArrays();
  }

  addProfessor(): void {
    this.loadingService.setLoadingState(true);
    const professorData = this.professorForm.value;
    this._http.post(`${environment.apiUrl}/professors`, professorData).subscribe({
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
    this._http.put(`${environment.apiUrl}/professors/${_id}`, professorData).subscribe({
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

  deleteProfessor(professor: any): void {
    this.loadingService.setLoadingState(true);
    this._http.delete(`${environment.apiUrl}/professors/${professor._id}`).subscribe({
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
