// ✅ YANGILANGAN VA TO‘LIQ OPTIMALLASHTIRILGAN PUBLICATIONS COMPONENT

import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
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
})
export class PublicationsComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  linkYears: number[] = [];
  groupedEntries: { title: string; year: number; entries: any[]; _id: string }[] = [];
  availableSections: any[] = [];

  entryForm: FormGroup;
  modalShow = false;
  sectionModal = false;
  entryModal = false;
  currentSectionId: string | null = null;
  currentEntryId: string | null = null;
  selectedFileName: string | null = null;
  routeSub!: Subscription;
  isClicked: boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private tokenHttp: TokenHttpService,
    private tokenService: TokenService
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2019; y--) this.linkYears.push(y);

    this.entryForm = this.fb.group({
      sectionId: [''],
      sectionTitle: [''],
      sectionYear: [''],
      code: [''],
      title: [''],
      authors: [''],
      source: [''],
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const year = params.get('id');
      if (year) this.loadAllData(year);
    });

    this.tokenService.auth$.subscribe(val => {
      this.isAuthenticated = val;
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  loadAllData(year: string) {
    this.loadingService.setLoadingState(true);
    forkJoin({
      entries: this._http.get<any[]>(`${environment.apiUrl}/entries?year=${year}`),
      sections: this._http.get<any[]>(`${environment.apiUrl}/sections?year=${year}`),
    }).subscribe({
      next: ({ entries, sections }) => {
        this.availableSections = sections;
        this.groupedEntries = this.groupEntries(entries, sections);
      },
      complete: () => this.loadingService.setLoadingState(false),
      error: (err) => {
        console.error(err);
        this.loadingService.setLoadingState(false);
      },
    });
  }

  private groupEntries(entries: any[], sections: any[]) {
    const groupMap = new Map<string, any>();

    sections.forEach((section) => {
      const key = `${section.title}-${section.year}`;
      groupMap.set(key, {
        title: section.title,
        year: section.year,
        _id: section._id,
        entries: [],
      });
    });

    entries.forEach((entry) => {
      const section = entry.sectionId;
      const key = `${section.title}-${section.year}`;
      if (groupMap.has(key)) {
        groupMap.get(key).entries.push(entry);
      }
    });

    return Array.from(groupMap.values());
  }

  openSectionModal(group: any = null) {
    this.modalShow = true;
    this.sectionModal = true;
    this.entryModal = false;
    this.currentSectionId = group?._id || null;
    this.entryForm.reset();

    if (group) {
      this.entryForm.patchValue({
        sectionId: group._id,
        sectionTitle: group.title,
        sectionYear: group.year,
      });
    }
  }

  openEntryModal(entry: any = null, group: any = null) {
    this.modalShow = true;
    this.sectionModal = false;
    this.entryModal = true;
    this.currentEntryId = entry?._id || null;
    this.currentSectionId = group?._id || entry?.sectionId?._id || null;
    this.entryForm.reset();

    if (entry) {
      this.entryForm.patchValue({
        sectionId: entry.sectionId?._id || entry.sectionId,
        code: entry.code,
        title: entry.title,
        authors: entry.authors,
        source: entry.source,
      });
    } else if (group) {
      this.entryForm.patchValue({
        sectionId: group._id,
      });
    }
  }

  submitForm(): void {
    if (this.sectionModal) {
      const section = this.currentSectionId ? 'update' : 'add';
      return section === 'update' ? this.updateSection() : this.addSection();
    }
    if (this.entryModal) {
      const entry = this.currentEntryId ? 'update' : 'add';
      return entry === 'update' ? this.updateEntry() : this.addEntry();
    }
  }

  private addSection() {
    const data = {
      title: this.entryForm.value.sectionTitle,
      year: this.entryForm.value.sectionYear,
    };
    this.tokenHttp.post(`${environment.apiUrl}/sections`, data).subscribe({
      next: () => this.afterSubmit(),
      error: (err) => this.handleError(err),
    });
  }

  private updateSection() {
    const data = {
      title: this.entryForm.value.sectionTitle,
      year: this.entryForm.value.sectionYear,
    };
    this.tokenHttp.put(`${environment.apiUrl}/sections/${this.currentSectionId}`, data).subscribe({
      next: () => this.afterSubmit(),
      error: (err) => this.handleError(err),
    });
  }

  private addEntry() {
    const data = this.getEntryData();
    const file = this.fileInputRef.nativeElement.files?.[0];

    this.tokenHttp.post(`${environment.apiUrl}/entries`, data).subscribe({
      next: (res: any) => {
        if (file) this.uploadPdf(file, res._id);
        else this.afterSubmit();
      },
      error: (err) => this.handleError(err),
    });
  }

  private updateEntry() {
    const data = this.getEntryData();
    const file = this.fileInputRef.nativeElement.files?.[0];

    this.tokenHttp.put(`${environment.apiUrl}/entries/${this.currentEntryId}`, data).subscribe({
      next: (res: any) => {
        if (file) this.uploadPdf(file, res._id);
        else this.afterSubmit();
      },
      error: (err) => this.handleError(err),
    });
  }

  private getEntryData() {
    return {
      sectionId: this.currentSectionId,
      title: this.entryForm.value.title,
      code: this.entryForm.value.code,
      authors: this.entryForm.value.authors,
      source: this.entryForm.value.source,
    };
  }

  deleteEntry(entry: any) {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;
    this.tokenHttp.delete(`${environment.apiUrl}/entries/${entry._id}`).subscribe({
      next: () => this.afterSubmit(),
      error: (err) => this.handleError(err),
    });
  }

  deleteSection(section: any) {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;
    this.tokenHttp.delete(`${environment.apiUrl}/sections/${section._id}`).subscribe({
      next: () => this.afterSubmit(),
      error: (err) => this.handleError(err),
    });
  }

  uploadPdf(file: File, entryId: string) {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('entryId', entryId);
    this.tokenHttp
      .post(`${environment.apiUrl}/entry-pdf-upload/upload`, formData)
      .subscribe({
        next: () => this.afterSubmit(),
        error: (err) => this.handleError(err),
      });
  }

  afterSubmit() {
    this.closeModal();
    this.loadAllData(this.route.snapshot.paramMap.get('id')!);
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
    this.entryModal = false;
    this.sectionModal = false;
    this.entryForm.reset();
    this.selectedFileName = null;
    this.currentEntryId = null;
    this.currentSectionId = null;
  
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
  

  onClick(event: Event) {
    event.preventDefault();
    this.isClicked = true;
    setTimeout(() => {
      this.isClicked = false;
    }, 200);
  }



}
