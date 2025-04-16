import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { ButtonComponent } from '../../../core/components/button/button.component';
import { InputComponent } from '../../../core/components/input/input.component';
import { ModalComponent } from '../../../core/components/modal/modal.component';
import { NgFor, NgIf } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';
import { TokenHttpService } from '../../../core/services/token-http.service';
import { TokenService } from '../../../core/services/auth.service';

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

  constructor(
    public fb: FormBuilder, 
    private loadingService: LoadingService, 
    private tokenHttp: TokenHttpService,
    private tokenService: TokenService
  ) {
    this.overviewForm = this.fb.group({
      title: ['', Validators.required],
      introduction: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      researchFocus: this.fb.array([
        this.createResearchFocus()
      ]),
      conclusion: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
    });
  }
  
  ngOnInit(): void {
    this.getAll();

    this.tokenService.auth$.subscribe(val => {
      this.isAuthenticated = val;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAll(){
    this.loadingService.setLoadingState(true);
    this._http.get(`${environment.apiUrl}/overviews`)
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
      }
    })
  }

  openModal(overview: any = null): void {
    this.currentOverview = overview;
    this.modalShow = true;

    this.overviewForm.reset();
    
    if (overview) {
      this.overviewForm.patchValue({
        title: overview.title
      });
  
      this.removeAllIntroduction(0);
      overview.introduction.forEach((intro: string) => {
        this.introduction.push(this.fb.control(intro));
      });
  
      this.removeAllResearchFocus(0);
      overview.researchFocus.forEach((focus: any) => {
        const researchGroup = this.fb.group({
          category: [focus.category],
          details: this.fb.array([])
        });
  
        focus.details.forEach((detail: string) => {
          (researchGroup.get('details') as FormArray).push(this.fb.control(detail));
        });
  
        this.researchFocus.push(researchGroup);
      });
  
      this.removeAllConclusion(0);
      overview.conclusion.forEach((conc: string) => {
        this.conclusion.push(this.fb.control(conc));
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

  get researchFocus() {
    return this.overviewForm.get('researchFocus') as FormArray;
  }

  get conclusion() {
    return this.overviewForm.get('conclusion') as FormArray;
  }

  createResearchFocus() {
    return this.fb.group({
      category: ['', Validators.required],
      details: this.fb.array([
        this.fb.control('', Validators.required)
      ])
    });
  }

  getDetailsArray(i: number): FormArray {
    return this.researchFocus.at(i).get('details') as FormArray;
  }

  addIntroduction() {
    this.introduction.push(this.fb.control('', Validators.required));
  }

  addResearchFocus() {
    this.researchFocus.push(this.createResearchFocus());
  }

  addDetail(i: number) {
    this.getDetailsArray(i).push(this.fb.control('', Validators.required));
  }

  removeResearchFocus(i: number) {
    this.researchFocus.removeAt(i);
  }

  addConclusion() {
    this.conclusion.push(this.fb.control('', Validators.required));
  }

  closeModal(): void {
    this.modalShow = false;  
    this.overviewForm.reset(); 

    this.removeAllIntroduction(1);
    this.removeAllResearchFocus(1);
    this.removeAllConclusion(1);
  }

  removeAllIntroduction(count: number): void {
    const introduction = this.overviewForm.get('introduction') as FormArray;
    while (introduction.length > count) {  
      introduction.removeAt(count);
    }
  }

  removeAllResearchFocus(count: number): void {
    const researchFocus = this.overviewForm.get('researchFocus') as FormArray;
    while (researchFocus.length > count) {  
      researchFocus.removeAt(count);
    }
  
    researchFocus.controls.forEach((focus) => {
      const details = focus.get('details') as FormArray;
      while (details.length > count) {  
        details.removeAt(count);
      }
    });
  }

  removeAllConclusion(count: number): void {
    const conclusion = this.overviewForm.get('conclusion') as FormArray;
    while (conclusion.length > count) {  
      conclusion.removeAt(count);
    }
  }

  addOverview(): void {
    this.loadingService.setLoadingState(true);
    const overviewData = this.overviewForm.value;
    this.tokenHttp.post(`${environment.apiUrl}/overviews`, overviewData)
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
      }
    });
  }

  updateOverview(_id: any): void {
    this.loadingService.setLoadingState(true);
    const overviewData = this.overviewForm.value;
    this.tokenHttp.put(`${environment.apiUrl}/overviews/${_id}`, overviewData)
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
      }
    });
  }

  deleteConfirmModal(){
    this.confirmModalShow = true;
  }

  closeDeleteConfirmModal(){
    this.confirmModalShow = false;
  }

  deleteOverview(overview: any): void {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;
    this.loadingService.setLoadingState(true);
    this.confirmModalShow = false;
    this.tokenHttp.delete(`${environment.apiUrl}/overviews/${overview?._id}`)
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
      }
    });
  }
}
