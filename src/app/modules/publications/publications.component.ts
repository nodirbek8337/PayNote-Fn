import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { LoadingService } from '../../core/services/loading.service';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { InputComponent } from '../../core/components/input/input.component';
import { ButtonComponent } from '../../core/components/button/button.component';
import { NgFor, NgIf } from '@angular/common';

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
export class PublicationsComponent implements OnInit {
  linkYears: number[] = [];
  groupedEntries: {
    title: string;
    year: number;
    entries: any[];
    _id: string;
  }[] = [];
  selectedFileName: string | null = null;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  entryForm: FormGroup;
  sectionForm: FormGroup;
  availableSections: any[] = [];
  modalShow = false;
  sectionModal = false;
  currentSection: any = null;
  currentEntry: any = null;

  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private fb: FormBuilder,
    private loadingService: LoadingService
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2019; y--) this.linkYears.push(y);

    this.entryForm = this.fb.group({
      sectionId: [''],
      code: [''],
      title: [''],
      authors: [''],
      source: [''],
    });

    this.sectionForm = this.fb.group({
      title: [''],
      year: [currentYear],
    });
  }

  ngOnInit(): void {
    const year = this.route.snapshot.paramMap.get('id');
    if (year) this.getEntries(year);
    this.getSections();
  }

  getEntries(year: string) {
    this.loadingService.setLoadingState(true);
    this._http
      .get<any[]>(`${environment.apiUrl}/entries?year=${year}`)
      .subscribe({
        next: (res) => {
          const groupMap = new Map<string, any>();
          res.forEach((entry) => {
            const section = entry.sectionId;
            const key = section.title + '-' + section.year;
            if (!groupMap.has(key)) {
              groupMap.set(key, {
                title: section.title,
                year: section.year,
                _id: section._id,
                entries: [],
              });
            }
            groupMap.get(key).entries.push(entry);
          });
          this.groupedEntries = Array.from(groupMap.values());
        },
        complete: () => this.loadingService.setLoadingState(false),
        error: (err) => {
          console.error(err);
          this.loadingService.setLoadingState(false);
        },
      });
  }

  getSections() {
    this._http.get(`${environment.apiUrl}/sections`).subscribe({
      next: (res: any) => (this.availableSections = res),
      error: (err) => console.error('Sectionlar xatolik:', err),
    });
  }

  triggerFileInput() {
    this.fileInputRef.nativeElement.click();
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
      this.selectedFileName = file
        ? this.truncateFileName(file.name, 30)
        : null;
    }
  }

  truncateFileName(name: string, maxLength: number): string {
    if (name.length <= maxLength) return name;
    const ext = name.substring(name.lastIndexOf('.'));
    const base = name.substring(0, maxLength - ext.length - 3);
    return base + ext;
  }

  openSectionModal(section: any = null) {
    this.sectionModal = true;
    this.modalShow = true;
    this.currentSection = section;
    this.sectionForm.reset();
    if (section) this.sectionForm.patchValue(section);
  }

  openEntryModal(entry: any = null) {
    this.sectionModal = false;
    this.modalShow = true;
    this.currentEntry = entry;
    this.entryForm.reset();
    if (entry) this.entryForm.patchValue(entry);
  }

  submitForm(): void {
    if (this.sectionModal) {
      this.currentSection
        ? this.updateSection(this.currentSection._id)
        : this.addSection();
    } else {
      this.currentEntry
        ? this.updateEntry(this.currentEntry._id)
        : this.addEntry();
    }
  }

  updateSection(sectionId: string) {
    this._http
      .put(
        `${environment.apiUrl}/sections/${sectionId}`,
        this.sectionForm.value
      )
      .subscribe({
        next: () => {
          this.closeModal();
          this.getEntries(this.route.snapshot.paramMap.get('id')!);
          this.getSections();
        },
        error: (err) => console.error(err),
      });
  }

  addSection() {
    this._http
      .post(`${environment.apiUrl}/sections`, this.sectionForm.value)
      .subscribe({
        next: () => {
          this.closeModal();
          this.getEntries(this.route.snapshot.paramMap.get('id')!);
          this.getSections();
        },
        error: (err) => console.error(err),
      });
  }

  deleteSection(section: any) {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;
    this._http
      .delete(`${environment.apiUrl}/sections/${section._id}`)
      .subscribe({
        next: () => {
          this.getEntries(this.route.snapshot.paramMap.get('id')!);
          this.getSections();
        },
        error: (err) => console.error(err),
      });
  }

  addEntry() {
    const file = this.fileInputRef.nativeElement.files?.[0];
    this._http
      .post(`${environment.apiUrl}/entries`, this.entryForm.value)
      .subscribe({
        next: (res: any) => {
          if (file) this.uploadPdf(file, res._id);
          else this.finishEntryAction();
        },
        error: (err) => console.error(err),
      });
  }

  updateEntry(entryId: string) {
    const file = this.fileInputRef.nativeElement.files?.[0];
    this._http
      .put(`${environment.apiUrl}/entries/${entryId}`, this.entryForm.value)
      .subscribe({
        next: () => {
          if (file) this.uploadPdf(file, entryId);
          else this.finishEntryAction();
        },
        error: (err) => console.error(err),
      });
  }

  deleteEntry(entry: any) {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;

    this._http.delete(`${environment.apiUrl}/entries/${entry._id}`).subscribe({
      next: () => this.getEntries(this.route.snapshot.paramMap.get('id')!),
    });
  }

  uploadPdf(file: File, entryId: string) {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('entryId', entryId);

    this._http
      .post(`${environment.apiUrl}/entry-pdf-upload/upload`, formData)
      .subscribe({
        next: () => this.finishEntryAction(),
      });
  }

  finishEntryAction() {
    this.modalShow = false;
    this.getEntries(this.route.snapshot.paramMap.get('id')!);
    this.fileInputRef.nativeElement.value = '';
    this.selectedFileName = null;
    this.currentEntry = null;
    this.currentSection = null;
  }

  openPdf(url: string | null): void {
    if (!url) return;
    let pdfUrl = url;
    if (pdfUrl.includes('drive.google.com/file/d/')) {
      pdfUrl = pdfUrl
        .replace(
          'https://drive.google.com/file/d/',
          'https://drive.google.com/uc?export=view&id='
        )
        .split('/view')[0];
    }
    window.open(pdfUrl, '_blank');
  }

  closeModal() {
    this.modalShow = false;
    this.entryForm.reset();
    this.sectionForm.reset();
    this.fileInputRef.nativeElement.value = '';
    this.selectedFileName = null;
    this.currentEntry = null;
    this.currentSection = null;
  }
}
