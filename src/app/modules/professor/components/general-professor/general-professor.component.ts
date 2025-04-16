import { Component, Input, OnInit, ViewChild, ElementRef, inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../../environments/environments';
import { LoadingService } from '../../../../core/services/loading.service';
import { TokenHttpService } from '../../../../core/services/token-http.service';
import { TokenService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-general-professor',
  standalone: true,
  template: '', 
  styleUrls: [],
  imports: [ReactiveFormsModule, HttpClientModule],
})
export abstract class GeneralProfessorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() professorType: string = 'regular';
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  _http = inject(HttpClient);
  loadingService = inject(LoadingService);
  tokenHttp = inject(TokenHttpService);
  tokenService = inject(TokenService);

  professorForm!: FormGroup;
  professors: any[] = [];
  currentProfessor: any = null;
  modalShow: boolean = false;
  selectedFileName: string | null = null;
  isAuthenticated: boolean = false;

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.getProfessors();

    this.tokenService.auth$.subscribe(val => {
      this.isAuthenticated = val;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.professorForm = this.fb.group({
      fullName: ['', Validators.required],
      type: [this.professorType],
      position: ['', Validators.required],
      department: ['', Validators.required],
      university: ['', Validators.required],
      nationality: ['', Validators.required],
      researchGroup: ['', Validators.required],
      website: ['', Validators.required],
      imageUrl: [''],
      contact: this.fb.group({
        address: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        officePhone: ['', Validators.required],
        cellPhone: ['', Validators.required],
        officeFax: ['', Validators.required],
        period: ['', Validators.required],
      }),
      researchAreas: this.fb.array([]),
      education: this.fb.array([]),
      career: this.fb.array([]),
      awards: this.fb.array([]),
    });
  }

  getProfessors() {
    this.loadingService.setLoadingState(true);
    const params = new HttpParams().set('type', this.professorType);
    this._http.get(`${environment.apiUrl}/professors`, { params })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => (this.professors = res),
      complete: () => this.loadingService.setLoadingState(false),
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  triggerFileInput() {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const maxSize = 2 * 1024 * 1024;

    if (file && file.size > maxSize) {
      alert('Rasm hajmi 2MB dan oshmasligi kerak!');
      this.fileInputRef.nativeElement.value = '';
      this.selectedFileName = null;
    } else {
      this.selectedFileName = file ? this.truncateFileName(file.name, 30) : null;
    }
  }

  truncateFileName(name: string, maxLength: number): string {
    if (name.length <= maxLength) return name;
    const ext = name.substring(name.lastIndexOf('.'));
    const base = name.substring(0, maxLength - ext.length - 3);
    return base + ext;
  }

  openModal(professor: any = null): void {
    this.currentProfessor = professor;
    this.modalShow = true;
    this.clearFormArrays();
    this.professorForm.reset();
    this.professorForm.patchValue({ type: this.professorType });

    if (professor) {
      this.professorForm.patchValue(professor);
      professor.researchAreas?.forEach((area: string) => {
        this.researchAreas.push(this.fb.control(area));
      });
      professor.education?.forEach((e: any) =>
        this.education.push(this.fb.group(e))
      );
      professor.career?.forEach((c: any) => this.career.push(this.fb.group(c)));
      professor.awards?.forEach((a: any) => this.awards.push(this.fb.group(a)));
    }
  }

  submitForm(): void {
    if (this.professorForm.invalid) {
      this.professorForm.markAllAsTouched();
      return;
    }
  
    this.currentProfessor
      ? this.updateProfessor(this.currentProfessor._id)
      : this.addProfessor();
  }
  

  addProfessor(): void {
    this.loadingService.setLoadingState(true);
    const data = this.professorForm.value;

    this.tokenHttp.post(`${environment.apiUrl}/professors`, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        const id = res._id;
        const file = this.fileInputRef.nativeElement.files?.[0];

        if (file) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('professorId', id);

          this.tokenHttp
            .post(`${environment.apiUrl}/professor-image-upload/upload`, formData)
            .subscribe({
              complete: () => {
                this.modalShow = false;
                this.getProfessors();
                this.loadingService.setLoadingState(false);
              },
              error: (err) => console.error('Rasm xatolik:', err),
            });
        } else {
          this.modalShow = false;
          this.getProfessors();
          this.loadingService.setLoadingState(false);
        }
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  updateProfessor(_id: string): void {
    this.loadingService.setLoadingState(true);
    const data = this.professorForm.value;

    this.tokenHttp.put(`${environment.apiUrl}/professors/${_id}`, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        const file = this.fileInputRef.nativeElement.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('professorId', _id);

          this.tokenHttp
            .post(`${environment.apiUrl}/professor-image-upload/upload`, formData)
            .subscribe({
              complete: () => {
                this.modalShow = false;
                this.getProfessors();
                this.loadingService.setLoadingState(false);
              },
              error: (err) => console.error('Rasm xatolik:', err),
            });
        } else {
          this.modalShow = false;
          this.getProfessors();
          this.loadingService.setLoadingState(false);
        }
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  deleteProfessor(professor: any): void {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;
    this.loadingService.setLoadingState(true);
    this.tokenHttp.delete(`${environment.apiUrl}/professors/${professor._id}`)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.tokenHttp
          .delete(`${environment.apiUrl}/professor-image-upload/${professor._id}`)
          .subscribe({
            next: () => this.getProfessors(),
            error: (err) => console.error('Rasm o‘chirishda xato:', err),
            complete: () => this.loadingService.setLoadingState(false),
          });
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  // === Form array getter ===
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

  addItem(field: FormArray) {
    field.push(this.fb.control('', Validators.required));
  }

  addEducation() {
    this.education.push(this.fb.group({
      year: ['', Validators.required],
      university: ['', Validators.required],
      major: ['', Validators.required],
      degree: ['', Validators.required],
    }));
  }
  
  addCareer() {
    this.career.push(this.fb.group({
      year: ['', Validators.required],
      position: ['', Validators.required],
      university: ['', Validators.required],
    }));
  }

  addAward() {
    this.awards.push(this.fb.group({
      year: ['', Validators.required],
      title: ['', Validators.required],
    }));
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

  closeModal() {
    this.modalShow = false;
    this.professorForm.reset();
    this.clearFormArrays();
  }
}
