import { Component } from '@angular/core';
import { FormsModule,ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule , ReactiveFormsModule,CommonModule,],
  styles: [`
    .forgot-link {
      color: #6c757d;
      text-decoration: none;
      cursor: pointer;
    }
    .forgot-link:hover {
      color: #ffc107 !important;
      text-decoration: underline !important;
    }
  `],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
 loginForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  goToRegister() {
  this.router.navigate(['/register']);
}

  async onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.successMessage = 'Logged in successfully! Redirecting...';

      setTimeout(() => {
        this.successMessage = '';
        this.router.navigate(['/home']); 
      },);

    } catch (error: any) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        this.errorMessage = 'Incorrect email or password';
      } else {
        this.errorMessage = 'An unexpected error occurred';
      }
    }
  }
async onForgotPassword() {
  const email = this.loginForm.get('email')?.value;

  if (!email) {
    this.errorMessage = 'Please enter your email to reset your password.';
    return;
  }

  try {
    await sendPasswordResetEmail(this.auth, email);
    this.successMessage = 'A password reset link has been sent to your email.';
    this.errorMessage = '';
  } catch (error: any) {
    this.successMessage = '';
    if (error.code === 'auth/user-not-found') {
      this.errorMessage = 'No user found with this email.';
    } else if (error.code === 'auth/invalid-email') {
      this.errorMessage = 'Please enter a valid email address.';
    } else {
      this.errorMessage = 'Something went wrong. Please try again.';
    }
  }
}

}
