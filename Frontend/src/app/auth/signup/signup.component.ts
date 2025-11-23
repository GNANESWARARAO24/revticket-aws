import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.authService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/user/home']);
        },
        error: (error) => {
          this.error = 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}