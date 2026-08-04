import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { BlockedSlotDto } from '../../../core/models/api.models';
import { AdminConfirmModalComponent } from '../../shared/admin-confirm-modal.component';
import { AdminConfirmKind } from '../../shared/admin-confirm.types';
import {
  ADMIN_FORM_REQUIRED_SUMMARY,
  adminControlInvalid,
  adminFieldError,
  validateAdminForm,
} from '../../shared/admin-form-validation.util';

type PendingConfirm =
  | { action: 'add' }
  | { action: 'savePromo' }
  | { action: 'delete'; id: number };

import { AdminButtonSpinnerComponent } from '../../shared/admin-button-spinner.component';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, AdminConfirmModalComponent, AdminButtonSpinnerComponent],
  templateUrl: './settings.html',
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminApi = inject(AdminApiService);

  readonly formSummary = ADMIN_FORM_REQUIRED_SUMMARY;
  readonly blockedSlots = signal<BlockedSlotDto[]>([]);
  readonly promoSaving = signal(false);
  readonly promoSaved = signal(false);
  readonly promoError = signal<string | null>(null);
  readonly pendingConfirm = signal<PendingConfirm | null>(null);
  readonly confirming = signal(false);
  readonly blockedSubmitted = signal(false);
  readonly promoSubmitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    date: ['', Validators.required],
    timeSlot: [''],
    reason: [''],
    allDay: [false],
  });

  readonly promoForm = this.fb.nonNullable.group({
    isEnabled: [true],
    messageText: ['', Validators.required],
    ctaText: ['', Validators.required],
    ctaLink: [''],
  });

  ngOnInit() {
    this.load();
    this.loadPromo();
  }

  load() {
    this.adminApi.getBlockedSlots().subscribe((s) => this.blockedSlots.set(s));
  }

  loadPromo() {
    this.adminApi.getPromoBanner().subscribe({
      next: (banner) => {
        this.promoForm.patchValue({
          isEnabled: banner.isEnabled,
          messageText: banner.messageText,
          ctaText: banner.ctaText ?? '',
          ctaLink: banner.ctaLink ?? '/randevu',
        });
      },
      error: () => this.promoError.set('Promosyon banner ayarları yüklenemedi.'),
    });
  }

  blockedFieldInvalid(name: 'date'): boolean {
    return adminControlInvalid(this.form.get(name), this.blockedSubmitted());
  }

  blockedFieldError(name: 'date'): string | null {
    return adminFieldError(this.form.get(name), this.blockedSubmitted());
  }

  promoFieldInvalid(name: 'messageText' | 'ctaText'): boolean {
    return adminControlInvalid(this.promoForm.get(name), this.promoSubmitted());
  }

  promoFieldError(name: 'messageText' | 'ctaText'): string | null {
    return adminFieldError(this.promoForm.get(name), this.promoSubmitted());
  }

  askSavePromo() {
    this.promoError.set(null);
    this.promoSaved.set(false);

    if (!validateAdminForm(this.promoForm, () => this.promoSubmitted.set(true))) {
      return;
    }

    this.pendingConfirm.set({ action: 'savePromo' });
  }

  askAdd() {
    if (!validateAdminForm(this.form, () => this.blockedSubmitted.set(true))) {
      return;
    }

    this.pendingConfirm.set({ action: 'add' });
  }

  askRemove(id: number) {
    this.pendingConfirm.set({ action: 'delete', id });
  }

  closeConfirm() {
    if (this.confirming()) return;
    this.pendingConfirm.set(null);
  }

  confirmKind(): AdminConfirmKind {
    const pending = this.pendingConfirm();
    if (!pending) return 'confirm';
    if (pending.action === 'delete') return 'delete';
    if (pending.action === 'add') return 'add';
    return 'save';
  }

  confirmLabel(): string {
    const pending = this.pendingConfirm();
    if (!pending) return 'Onayla';
    if (pending.action === 'delete') return 'Sil';
    if (pending.action === 'add') return 'Ekle';
    return 'Kaydet';
  }

  confirmVariant(): 'primary' | 'danger' {
    return this.pendingConfirm()?.action === 'delete' ? 'danger' : 'primary';
  }

  submitConfirm() {
    const pending = this.pendingConfirm();
    if (!pending || this.confirming()) return;

    this.confirming.set(true);

    if (pending.action === 'add') {
      this.executeAdd();
    } else if (pending.action === 'savePromo') {
      this.executeSavePromo();
    } else {
      this.executeRemove(pending.id);
    }
  }

  private executeSavePromo() {
    const v = this.promoForm.getRawValue();
    this.promoSaving.set(true);
    this.promoSaved.set(false);
    this.promoError.set(null);

    this.adminApi
      .updatePromoBanner({
        isEnabled: v.isEnabled,
        messageText: v.messageText,
        ctaText: v.ctaText || null,
        ctaLink: v.ctaLink || null,
      })
      .subscribe({
        next: () => {
          this.confirming.set(false);
          this.promoSaving.set(false);
          this.promoSaved.set(true);
          this.promoSubmitted.set(false);
          this.pendingConfirm.set(null);
        },
        error: () => {
          this.confirming.set(false);
          this.promoSaving.set(false);
          this.promoError.set('Promosyon banner kaydedilemedi.');
          this.pendingConfirm.set(null);
        },
      });
  }

  private executeAdd() {
    const v = this.form.getRawValue();
    this.adminApi
      .createBlockedSlot(v.date, v.allDay ? null : v.timeSlot || null, v.reason)
      .subscribe({
        next: () => {
          this.confirming.set(false);
          this.form.reset({ allDay: false });
          this.blockedSubmitted.set(false);
          this.pendingConfirm.set(null);
          this.load();
        },
        error: () => {
          this.confirming.set(false);
          this.pendingConfirm.set(null);
        },
      });
  }

  private executeRemove(id: number) {
    this.adminApi.deleteBlockedSlot(id).subscribe({
      next: () => {
        this.confirming.set(false);
        this.pendingConfirm.set(null);
        this.load();
      },
      error: () => {
        this.confirming.set(false);
        this.pendingConfirm.set(null);
      },
    });
  }
}
