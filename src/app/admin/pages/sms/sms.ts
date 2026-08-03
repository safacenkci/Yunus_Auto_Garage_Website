import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { SmsLogDto } from '../../../core/models/api.models';
import { AdminConfirmModalComponent } from '../../shared/admin-confirm-modal.component';
import {
  ADMIN_FIELD_REQUIRED,
  ADMIN_FORM_REQUIRED_SUMMARY,
  adminControlInvalid,
  adminFieldError,
} from '../../shared/admin-form-validation.util';

import { AdminButtonSpinnerComponent } from '../../shared/admin-button-spinner.component';

@Component({
  selector: 'app-sms',
  imports: [ReactiveFormsModule, DatePipe, AdminConfirmModalComponent, AdminButtonSpinnerComponent],
  templateUrl: './sms.html',
})
export class SmsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminApi = inject(AdminApiService);

  readonly formSummary = ADMIN_FORM_REQUIRED_SUMMARY;
  readonly tab = signal<'send' | 'history'>('send');
  readonly logs = signal<SmsLogDto[]>([]);
  readonly showConfirm = signal(false);
  readonly sending = signal(false);
  readonly result = signal('');
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    recipientSource: ['all'],
    statusFilter: ['Pending'],
    manualNumbers: [''],
    message: ['', Validators.required],
  });

  ngOnInit() {
    this.loadLogs();
  }

  charCount(): number {
    return this.form.getRawValue().message.length;
  }

  smsCount(): number {
    return Math.ceil(this.charCount() / 155) || 0;
  }

  loadLogs() {
    this.adminApi.getSmsLogs().subscribe((r) => this.logs.set(r.items));
  }

  fieldInvalid(name: 'message' | 'manualNumbers'): boolean {
    if (name === 'manualNumbers') {
      return this.submitted() && this.manualNumbersMissing();
    }
    return adminControlInvalid(this.form.get(name), this.submitted());
  }

  fieldError(name: 'message' | 'manualNumbers'): string | null {
    if (name === 'manualNumbers') {
      if (this.submitted() && this.manualNumbersMissing()) {
        return ADMIN_FIELD_REQUIRED;
      }
      return null;
    }
    return adminFieldError(this.form.get(name), this.submitted());
  }

  askSend() {
    this.result.set('');

    if (!this.validateForm()) {
      return;
    }

    this.showConfirm.set(true);
  }

  closeConfirm() {
    if (this.sending()) return;
    this.showConfirm.set(false);
  }

  send() {
    if (this.sending()) return;

    this.sending.set(true);
    const v = this.form.getRawValue();
    this.adminApi
      .sendBulkSms(v.recipientSource, v.message, v.statusFilter, v.manualNumbers)
      .subscribe({
        next: (r) => {
          this.sending.set(false);
          this.showConfirm.set(false);
          this.submitted.set(false);
          this.result.set(`${r.recipientCount} kişiye gönderildi. Kod: ${r.resultCode}`);
          this.loadLogs();
        },
        error: () => {
          this.sending.set(false);
          this.result.set('Gönderim başarısız.');
        },
      });
  }

  private validateForm(): boolean {
    this.form.markAllAsTouched();
    this.submitted.set(true);

    if (this.form.get('message')?.invalid) {
      return false;
    }

    if (this.manualNumbersMissing()) {
      return false;
    }

    return true;
  }

  private manualNumbersMissing(): boolean {
    const v = this.form.getRawValue();
    return v.recipientSource === 'manual' && !v.manualNumbers.trim();
  }
}
