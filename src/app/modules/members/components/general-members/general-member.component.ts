import { Component, Input, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from '../../../../../environments/environments';
import { LoadingService } from '../../../../core/services/loading.service';
import { TokenHttpService } from '../../../../core/services/token-http.service';
import { TokenService } from '../../../../core/services/auth.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-general-member',
  standalone: true,
  template: '',
  imports: [ReactiveFormsModule, HttpClientModule],
})
export abstract class GeneralMemberComponent implements OnInit {
  @Input() academicStatus: string = 'alumni';
  _http = inject(HttpClient);
  loadingService = inject(LoadingService);

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  memberForm!: FormGroup;
  members: any[] = [];
  currentMember: any = null;
  modalShow: boolean = false;
  selectedFileName: string | null = null;
  isAuthenticated: boolean = false;

  constructor(
    public fb: FormBuilder, 
    private tokenHttp: TokenHttpService,
    private tokenService: TokenService) {}

  ngOnInit(): void {
    this.initForm();
    this.getMembers();

    this.tokenService.auth$.subscribe(val => {
      this.isAuthenticated = val;
    });
  }

  initForm() {
    this.memberForm = this.fb.group({
      fullName: ['', Validators.required],
      academicStatus: [this.academicStatus],
      nationality: ['', Validators.required],
      researchGroup: ['', Validators.required],
      year: ['', Validators.required],
      major: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imageUrl: [''],
      researchAreas: this.fb.array([]),
    });
  }

  getMembers() {
    this.loadingService.setLoadingState(true);
    const params = new HttpParams().set('academicStatus', this.academicStatus);
    this._http.get(`${environment.apiUrl}/members`, { params }).subscribe({
      next: (res: any) => (this.members = res),
      complete: () => this.loadingService.setLoadingState(false),
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  openModal(member: any = null): void {
    this.currentMember = member;
    this.modalShow = true;
    this.clearFormArrays();
    this.memberForm.reset();
    this.memberForm.patchValue({ academicStatus: this.academicStatus });

    if (member) {
      this.memberForm.patchValue(member);
      member.researchAreas?.forEach((area: string) => {
        this.researchAreas.push(this.fb.control(area));
      });
    }
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

  submitForm(): void {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }
  
    this.currentMember
      ? this.updateMember(this.currentMember._id)
      : this.addMember();
  }
  

  addMember(): void {
    this.loadingService.setLoadingState(true);
    const data = this.memberForm.value;
    this.tokenHttp.post(`${environment.apiUrl}/members`, data).subscribe({
      next: (res: any) => {
        const createdId = res._id;
        const file = this.fileInputRef.nativeElement.files?.[0];

        if (file) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('memberId', createdId);

          this.tokenHttp.post(`${environment.apiUrl}/member-image-upload/upload`, formData).subscribe({
            complete: () => {
              this.modalShow = false;
              this.getMembers();
              this.loadingService.setLoadingState(false);
            },
            error: (err) => console.error('Rasm yuklashda xatolik:', err)
          });
        } else {
          this.modalShow = false;
          this.getMembers();
          this.loadingService.setLoadingState(false);
        }
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  updateMember(_id: string): void {
    this.loadingService.setLoadingState(true);
    const data = this.memberForm.value;

    this.tokenHttp.put(`${environment.apiUrl}/members/${_id}`, data).subscribe({
      next: () => {
        const file = this.fileInputRef.nativeElement.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('memberId', _id);

          this.tokenHttp.post(`${environment.apiUrl}/member-image-upload/upload`, formData).subscribe({
            complete: () => {
              this.modalShow = false;
              this.getMembers();
              this.loadingService.setLoadingState(false);
            },
            error: (err) => console.error('Rasm yangilashda xatolik:', err)
          });
        } else {
          this.modalShow = false;
          this.getMembers();
          this.loadingService.setLoadingState(false);
        }
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  deleteMember(member: any): void {
    this.loadingService.setLoadingState(true);
    this.tokenHttp.delete(`${environment.apiUrl}/members/${member._id}`).subscribe({
      next: () => {
        this.tokenHttp.delete(`${environment.apiUrl}/member-image-upload/${member._id}`).subscribe({
          next: () => this.getMembers(),
          error: (err) => console.error('Rasm o‘chirishda xato:', err),
          complete: () => this.loadingService.setLoadingState(false)
        });
      },
      error: (err) => {
        console.log(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  get researchAreas() {
    return this.memberForm.get('researchAreas') as FormArray;
  }

  addItem(field: FormArray) {
    field.push(this.fb.control('', Validators.required));
  }

  removeItem(field: FormArray, index: number) {
    field.removeAt(index);
  }

  clearFormArrays() {
    this.researchAreas.clear();
  }

  closeModal() {
    this.modalShow = false;
    this.memberForm.reset();
    this.clearFormArrays();
  }
}
