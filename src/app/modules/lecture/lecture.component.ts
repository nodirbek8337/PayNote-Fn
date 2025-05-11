import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { LoadingService } from '../../core/services/loading.service';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { InputComponent } from '../../core/components/input/input.component';
import { ButtonComponent } from '../../core/components/button/button.component';
import { NgFor, NgIf } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';
import { TokenHttpService } from '../../core/services/token-http.service';
import { TokenService } from '../../core/services/auth.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-lecture',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    ModalComponent,
    InputComponent,
    ButtonComponent,
    NgFor,
    NgIf
  ],
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss'],
})
export class LectureComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  linkYears: number[] = [];
  groupedLectures: { title: string; year: number; lectures: any[]; _id: string }[] = [];
  availableSections: any[] = [];

  lectureForm: FormGroup;
  modalShow = false;
  sectionModal = false;
  lectureModal = false;
  currentSectionId: string | null = null;
  currentLectureId: string | null = null;
  selectedFileName: string | null = null;
  routeSub!: Subscription;
  isAuthenticated: boolean = false;
  submitInProgress = false;

  constructor(
    private _http: HttpClient,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private tokenHttp: TokenHttpService,
    private tokenService: TokenService
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2019; y--) this.linkYears.push(y);

    this.lectureForm = this.fb.group({
      sectionId: ['', Validators.required],
      sectionTitle: ['', Validators.required],
      sectionYear: ['', Validators.required],
      academic: ['', Validators.required],
      faculty: ['', Validators.required],
      courseName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAllData();

    this.tokenService.auth$.subscribe(val => {
      this.isAuthenticated = val;
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();

    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllData() {
    this.loadingService.setLoadingState(true);
    forkJoin({
      lectures: this._http.get<any[]>(`${environment.apiUrl}/lectures`),
      sections: this._http.get<any[]>(`${environment.apiUrl}/lecture-sections`),
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ lectures, sections }) => {
        this.availableSections = sections;
        this.groupedLectures = this.groupLectures(lectures, sections);
      },
      complete: () => this.loadingService.setLoadingState(false),
      error: (err) => {
        console.error(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  private groupLectures(lectures: any[], sections: any[]) {
    const groupMap = new Map<string, any>();

    sections.forEach((section) => {
      groupMap.set(section._id, {
        _id: section._id,
        title: section.title,
        year: section.year,
        lectures: [],
      });
    });

    lectures.forEach((lecture) => {
      const sectionId = lecture.sectionId;
      if (groupMap.has(sectionId)) {
        groupMap.get(sectionId).lectures.push(lecture);
      }
    });

    return Array.from(groupMap.values());
  }

  openSectionModal(group: any = null) {
    this.modalShow = true;
    this.sectionModal = true;
    this.lectureModal = false;
    this.currentSectionId = group?._id || null;
    this.lectureForm.reset();

    if (group) {
      this.lectureForm.patchValue({
        sectionId: group._id,
        sectionTitle: group.title,
        sectionYear: group.year,
      });
    }
  }

  openLectureModal(lecture: any = null, group: any = null) {
    this.modalShow = true;
    this.sectionModal = false;
    this.lectureModal = true;
    this.currentLectureId = lecture?._id || null;
    this.currentSectionId = group?._id || lecture?.sectionId?._id || null;
    this.lectureForm.reset();

    if (lecture) {
      this.lectureForm.patchValue({
        sectionId: lecture.sectionId?._id || lecture.sectionId,
        academic: lecture.academic,
        faculty: lecture.faculty,
        courseName: lecture.courseName,
      });
    } else if (group) {
      this.lectureForm.patchValue({
        sectionId: group._id,
      });
    }
  }

  submitForm(): void {
    if (this.submitInProgress) return;

    this.submitInProgress = true;

    if (this.sectionModal) {
      const sectionControls = this.lectureForm.controls;
      const requiredFields = ['sectionTitle', 'sectionYear'];
  
      const sectionInvalid = requiredFields.some((field) =>
        sectionControls[field].invalid
      );
  
      if (sectionInvalid) {
        requiredFields.forEach((field) => sectionControls[field].markAsTouched());
        return;
      }
  
      const section = this.currentSectionId ? 'update' : 'add';
      return section === 'update' ? this.updateSection() : this.addSection();
    }
  
    if (this.lectureModal) {
      const lectureControls = this.lectureForm.controls;
      const requiredFields = ['sectionId', 'academic', 'faculty', 'courseName'];
  
      const lectureInvalid = requiredFields.some((field) =>
        lectureControls[field].invalid
      );
  
      if (lectureInvalid) {
        requiredFields.forEach((field) => lectureControls[field].markAsTouched());
        return;
      }
  
      const lecture = this.currentLectureId ? 'update' : 'add';
      return lecture === 'update' ? this.updateLecture() : this.addLecture();
    }
  }

  private addSection() {
    const data = {
      title: this.lectureForm.value.sectionTitle,
      year: this.lectureForm.value.sectionYear,
    };
    this.tokenHttp.post(`${environment.apiUrl}/lecture-sections`, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.afterSubmit(); 
        this.submitInProgress = false;
      },
      error: (err) => {
        this.handleError(err)
        this.submitInProgress = false;
      }
    });
  }

  private updateSection() {
    const data = {
      title: this.lectureForm.value.sectionTitle,
      year: this.lectureForm.value.sectionYear,
    };
    this.tokenHttp.put(`${environment.apiUrl}/lecture-sections/${this.currentSectionId}`, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.afterSubmit(); 
        this.submitInProgress = false;
      },
      error: (err) => {
        this.handleError(err)
        this.submitInProgress = false;
      }
    });
  }

  private addLecture() {
    const data = this.getLectureData();
    const file = this.fileInputRef.nativeElement.files?.[0];

    this.tokenHttp.post(`${environment.apiUrl}/lectures`, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        if (file) this.uploadPdf(file, res._id);
        else this.afterSubmit();

        this.submitInProgress = false;
      },
      error: (err) => {
        this.handleError(err)
        this.submitInProgress = false;
      }
    });
  }

  private updateLecture() {
    const data = this.getLectureData();
    const file = this.fileInputRef.nativeElement.files?.[0];

    this.tokenHttp.put(`${environment.apiUrl}/lectures/${this.currentLectureId}`, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        if (file) this.uploadPdf(file, res._id);
        else this.afterSubmit();

        this.submitInProgress = false;
      },
      error: (err) => {
        this.handleError(err);
        this.submitInProgress = false;
      },
    });
  }

  private getLectureData() {
    return {
      sectionId: this.currentSectionId,
      academic: this.lectureForm.value.academic,
      faculty: this.lectureForm.value.faculty,
      courseName: this.lectureForm.value.courseName,
    };
  }

  deleteLecture(lecture: any) {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;
    this.tokenHttp.delete(`${environment.apiUrl}/lectures/${lecture._id}`)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.afterSubmit(); 
        this.submitInProgress = false;
      },
      error: (err) => {
        this.handleError(err)
        this.submitInProgress = false;
      }
    });
  }

  deleteSection(section: any) {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;
    this.tokenHttp.delete(`${environment.apiUrl}/lecture-sections/${section._id}`)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.afterSubmit(); 
        this.submitInProgress = false;
      },
      error: (err) => {
        this.handleError(err)
        this.submitInProgress = false;
      }
    });
  }

  uploadPdf(file: File, lectureId: string) {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('lectureId', lectureId);
    this.tokenHttp
      .post(`${environment.apiUrl}/lecture-pdf-upload/upload`, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
        this.afterSubmit(); 
        this.submitInProgress = false;
      },
      error: (err) => {
        this.handleError(err)
        this.submitInProgress = false;
      }
      });
  }

  afterSubmit() {
    this.loadAllData();
    this.closeModal();
  }

  handleError(err: any) {
    console.error(err);
    this.afterSubmit();
  }

  triggerFileInput() {
    this.fileInputRef?.nativeElement?.click();
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const maxSize = 4 * 1024 * 1024;
  
    if (file && file.size > maxSize) {
      alert('PDF hajmi 4MB dan oshmasligi kerak!');
      this.fileInputRef.nativeElement.value = '';
      this.selectedFileName = null;
    } else {
      this.selectedFileName = file ? this.truncateFileName(file.name, 30) : null;
    }
  }
  
  private truncateFileName(name: string, maxLength: number): string {
    if (name.length <= maxLength) return name;
    const ext = name.substring(name.lastIndexOf('.'));
    const base = name.substring(0, maxLength - ext.length - 3);
    return base + '...' + ext;
  }
  
  openPdf(url: string | null): void {
    if (!url) return;
    let pdfUrl = url;
    if (pdfUrl.includes('drive.google.com/file/d/')) {
      pdfUrl = pdfUrl
        .replace('https://drive.google.com/file/d/', 'https://drive.google.com/uc?export=view&id=')
        .split('/view')[0];
    }
    window.open(pdfUrl, '_blank');
  }

  closeModal() {
    this.modalShow = false;
    this.lectureModal = false;
    this.sectionModal = false;
    this.lectureForm.reset();
    this.selectedFileName = null;
    this.currentLectureId = null;
    this.currentSectionId = null;
  
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
}
