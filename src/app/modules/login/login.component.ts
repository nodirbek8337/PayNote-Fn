import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { environment } from '../../../environments/environments';
import { TokenService } from '../../core/services/auth.service';
import { InputComponent } from '../../core/components/input/input.component';
import { ButtonComponent } from '../../core/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [ReactiveFormsModule, InputComponent, NgIf, ButtonComponent],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = this.loginForm.value;

    this.http
      .post<any>(`${environment.apiUrl}/auth/login`, loginData)
      .subscribe({
        next: (response) => {
          if (response.token) {
            this.tokenService.login(response.token);
            this.router.navigate(['']);
          } else {
            this.errorMessage = 'Token topilmadi. Login muvaffaqiyatsiz.';
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login xatoligi';
          console.error('❌ Login xato:', this.errorMessage);
        },
      });
  }
}
