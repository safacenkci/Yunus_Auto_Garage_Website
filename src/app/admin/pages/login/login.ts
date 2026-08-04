import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  ADMIN_FORM_REQUIRED_SUMMARY,
  adminControlInvalid,
  adminFieldError,
  validateAdminForm,
} from '../../shared/admin-form-validation.util';

import { AdminButtonSpinnerComponent } from '../../shared/admin-button-spinner.component';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule, AdminButtonSpinnerComponent],
  templateUrl: './login.html',
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly formSummary = ADMIN_FORM_REQUIRED_SUMMARY;
  readonly error = signal('');
  readonly loading = signal(false);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  fieldInvalid(name: 'username' | 'password'): boolean {
    return adminControlInvalid(this.form.get(name), this.submitted());
  }

  fieldError(name: 'username' | 'password'): string | null {
    return adminFieldError(this.form.get(name), this.submitted());
  }

  submit() {
    this.error.set('');

    if (!validateAdminForm(this.form, () => this.submitted.set(true))) {
      return;
    }

    this.loading.set(true);
    const { username, password } = this.form.getRawValue();

    this.auth.login(username, password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token, res.expiresAt);
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Kullanıcı adı veya şifre hatalı.');
      },
    });
  }
}
