import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
import { NgFor, NgIf } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';
import { TokenHttpService } from '../../../core/services/token-http.service';
import { TokenService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-overview',
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  imports: [
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    NgFor,
    NgIf,
  ],
})
export class OverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  _http = inject(HttpClient);
  overviewForm: FormGroup;

  modalShow: boolean = false;
  confirmModalShow: boolean = false;
  overviews: any[] = [];
  currentOverview: any = null;
  isAuthenticated: boolean = false;

  langKey: string = '';

  constructor(
    public fb: FormBuilder,
    private loadingService: LoadingService,
    private tokenHttp: TokenHttpService,
    private tokenService: TokenService,
    private translate: TranslateService
  ) {
    const initialLang = this.translate.currentLang || 'uz';
    this.langKey = initialLang === 'ru' || initialLang === 'en' ? `_${initialLang}` : '';

    this.translate.onLangChange.subscribe(event => {
      const lang = event.lang;
      this.langKey = lang === 'ru' || lang === 'en' ? `_${lang}` : '';
    });

    this.overviewForm = this.fb.group({
      title: ['', Validators.required],
      title_ru: [''],
      title_en: [''],
    
      introduction: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      introduction_ru: this.fb.array([
        this.fb.control('')
      ]),
      introduction_en: this.fb.array([
        this.fb.control('')
      ]),
    
      researchFocus: this.fb.array([
        this.createResearchFocus()
      ]),
    
      conclusion: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      conclusion_ru: this.fb.array([
        this.fb.control('')
      ]),
      conclusion_en: this.fb.array([
        this.fb.control('')
      ]),
    });
  }

  ngOnInit(): void {
    this.getAll();

    this.tokenService.auth$.subscribe((val) => {
      this.isAuthenticated = val;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAll() {
    this.loadingService.setLoadingState(true);
    this._http
      .get(`${environment.apiUrl}/overviews`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.overviews = [...res];
        },
        complete: () => {
          this.loadingService.setLoadingState(false);
        },
        error: (err) => {
          console.log(err);
          this.loadingService.setLoadingState(false);
        },
      });
  }

  openModal(overview: any = null): void { 
    this.currentOverview = overview;
    this.modalShow = true;

    this.overviewForm.reset();

    if (overview) {
      this.overviewForm.patchValue({
        title: overview.title,
        title_ru: overview.title_ru,
        title_en: overview.title_en,
      });

      this.removeAllIntroduction(0);
      overview.introduction?.forEach((intro: string) => {
        this.introduction.push(this.fb.control(intro));
      });

      overview.introduction_ru?.forEach((intro: string) => {
        this.introduction_ru.push(this.fb.control(intro));
      });

      overview.introduction_en?.forEach((intro: string) => {
        this.introduction_en.push(this.fb.control(intro));
      });

      this.removeAllResearchFocus(0);
      overview.researchFocus?.forEach((focus: any) => {
        const researchGroup = this.fb.group({
          category: [focus.category || ''],
          category_ru: [focus.category_ru || ''],
          category_en: [focus.category_en || ''],

          details: this.fb.array([]),
          details_ru: this.fb.array([]),
          details_en: this.fb.array([]),
        });

        (focus.details || []).forEach((d: string) => {
          (researchGroup.get('details') as FormArray).push(this.fb.control(d));
        });

        (focus.details_ru || []).forEach((d: string) => {
          (researchGroup.get('details_ru') as FormArray).push(this.fb.control(d));
        });

        (focus.details_en || []).forEach((d: string) => {
          (researchGroup.get('details_en') as FormArray).push(this.fb.control(d));
        });

        this.researchFocus.push(researchGroup);
      });


      this.removeAllConclusion(0);

    (overview.conclusion || []).forEach((conc: string) => {
      this.conclusion.push(this.fb.control(conc));
    });
    (overview.conclusion_ru || []).forEach((conc: string) => {
      this.conclusion_ru.push(this.fb.control(conc));
    });
    (overview.conclusion_en || []).forEach((conc: string) => {
      this.conclusion_en.push(this.fb.control(conc));
    });
    } else {
      this.overviewForm.reset();
    }
  }

  submitForm(): void {
    if (this.overviewForm.invalid) {
      this.overviewForm.markAllAsTouched();
      return;
    }

    this.currentOverview
      ? this.updateOverview(this.currentOverview._id)
      : this.addOverview();
  }

  get introduction() {
    return this.overviewForm.get('introduction') as FormArray;
  }

  get introduction_ru() {
    return this.overviewForm.get('introduction_ru') as FormArray;
  }
  get introduction_en() {
    return this.overviewForm.get('introduction_en') as FormArray;
  }

  get researchFocus() {
    return this.overviewForm.get('researchFocus') as FormArray;
  }

  get conclusion() {
    return this.overviewForm.get('conclusion') as FormArray;
  }

  get conclusion_ru() {
    return this.overviewForm.get('conclusion_ru') as FormArray;
  }
  get conclusion_en() {
    return this.overviewForm.get('conclusion_en') as FormArray;
  }

  createResearchFocus() {
    return this.fb.group({
      category: [''],
      category_ru: [''],
      category_en: [''],
      details: this.fb.array([this.fb.control('')]),
      details_ru: this.fb.array([this.fb.control('')]),
      details_en: this.fb.array([this.fb.control('')]),
    });
  }

  getDetailsArray(i: number, key: 'details' | 'details_ru' | 'details_en'): FormArray {
    return this.researchFocus.at(i).get(key) as FormArray;
  }

  addIntroductionAll() {
    this.introduction.push(this.fb.control('', Validators.required));
    this.introduction_ru.push(this.fb.control(''));
    this.introduction_en.push(this.fb.control(''));
  }

  addResearchFocus() {
    this.researchFocus.push(this.createResearchFocus());
  }

  addDetailAll(i: number) {
    const control = this.fb.control('');
    this.getDetailsArray(i, 'details').push(this.fb.control('', Validators.required));
    this.getDetailsArray(i, 'details_ru').push(this.fb.control(''));
    this.getDetailsArray(i, 'details_en').push(this.fb.control(''));
  }

  removeResearchFocus(i: number) {
    this.researchFocus.removeAt(i);
  }

  addConclusionAll() {
    this.conclusion.push(this.fb.control('', Validators.required));
    this.conclusion_ru.push(this.fb.control(''));
    this.conclusion_en.push(this.fb.control(''));
  }

  closeModal(): void {
    this.modalShow = false;
    this.overviewForm.reset();

    this.removeAllIntroduction(1);
    this.removeAllResearchFocus(1);
    this.removeAllConclusion(1);
  }

  removeAllIntroduction(count: number): void {
    const fields = ['introduction', 'introduction_ru', 'introduction_en'];
    for (const field of fields) {
      const arr = this.overviewForm.get(field) as FormArray;
      while (arr.length > count) {
        arr.removeAt(count);
      }
    }
  }

  removeAllResearchFocus(count: number): void {
    const researchFocus = this.researchFocus;
    while (researchFocus.length > count) {
      researchFocus.removeAt(count);
    }
  
    researchFocus.controls.forEach((focus) => {
      const detailKeys = ['details', 'details_ru', 'details_en'];
      for (const key of detailKeys) {
        const arr = focus.get(key) as FormArray;
        while (arr && arr.length > count) {
          arr.removeAt(count);
        }
      }
    });
  }

  removeAllConclusion(count: number): void {
    const fields = ['conclusion', 'conclusion_ru', 'conclusion_en'];
    for (const field of fields) {
      const arr = this.overviewForm.get(field) as FormArray;
      while (arr.length > count) {
        arr.removeAt(count);
      }
    }
  }

  addOverview(): void {
    this.loadingService.setLoadingState(true);
    const overviewData = this.overviewForm.value;
    this.tokenHttp
      .post(`${environment.apiUrl}/overviews`, overviewData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.modalShow = false;
          this.getAll();
        },
        complete: () => {
          this.loadingService.setLoadingState(false);
        },
        error: (err) => {
          console.log(err);
          this.loadingService.setLoadingState(false);
        },
      });
  }

  updateOverview(_id: any): void {
    this.loadingService.setLoadingState(true);
    const overviewData = this.overviewForm.value;
    this.tokenHttp
      .put(`${environment.apiUrl}/overviews/${_id}`, overviewData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.modalShow = false;
          this.getAll();
        },
        complete: () => {
          this.loadingService.setLoadingState(false);
        },
        error: (err) => {
          console.log(err);
          this.loadingService.setLoadingState(false);
        },
      });
  }

  deleteConfirmModal() {
    this.confirmModalShow = true;
  }

  closeDeleteConfirmModal() {
    this.confirmModalShow = false;
  }

  deleteOverview(overview: any): void {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;
    this.loadingService.setLoadingState(true);
    this.confirmModalShow = false;
    this.tokenHttp
      .delete(`${environment.apiUrl}/overviews/${overview?._id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getAll();
        },
        complete: () => {
          this.loadingService.setLoadingState(false);
        },
        error: (err) => {
          console.log(err);
          this.loadingService.setLoadingState(false);
        },
      });
  }
}
