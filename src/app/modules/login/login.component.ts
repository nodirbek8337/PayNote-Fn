import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { InputComponent } from '../../core/components/input/input.component';
import { environment } from '../../../environments/environments';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [ReactiveFormsModule, InputComponent, NgClass],
})
export class LoginComponent {
  loginForm: FormGroup;
  isClicked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.http
        .post<any>(`${environment.apiUrl}/auth/login`, loginData)
        .subscribe({
          next: (response) => {
            if (response.token) {
              localStorage.setItem('login_access_token', response.token);
              console.log('✅ Token saqlandi:', response.token);

              this.router.navigate(['']);
            }
          },
          error: (error) => {
            console.error(
              '❌ Login xatolik:',
              error.error?.message || error.message
            );
            alert(error.error?.message || 'Login xatoligi');
          },
        });
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
