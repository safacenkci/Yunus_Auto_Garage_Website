import { DatePipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { AppointmentResponse } from '../../../core/models/api.models';
import { AdminConfirmModalComponent } from '../../shared/admin-confirm-modal.component';
import { AdminConfirmKind } from '../../shared/admin-confirm.types';
import { lockAdminOverlay } from '../../shared/admin-overlay-lock';
import { formatPhoneDisplay, phoneTelHref } from '../../../core/utils/phone.util';

type PendingConfirm = {
  id: string;
  kind: AdminConfirmKind;
  status: string;
  description?: string;
  confirmLabel: string;
  confirmVariant: 'primary' | 'danger' | 'secondary';
};

const WORK_STATUS_OPTIONS = [
  { value: 'None', label: 'Henüz işlem başlamadı' },
  { value: 'VehicleReceived', label: 'Araç Teslim Alındı' },
  { value: 'InProgress', label: 'İşleme Başlandı' },
  { value: 'ReadyForPickup', label: 'Teslime Hazır' },
  { value: 'Delivered', label: 'Teslim Edildi' },
] as const;

@Component({
  selector: 'app-appointments',
  imports: [AdminConfirmModalComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './appointments.html',
})
export class AppointmentsComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);

  readonly appointments = signal<AppointmentResponse[]>([]);
  readonly total = signal(0);
  readonly statusFilter = signal('');
  readonly page = signal(1);
  readonly pendingConfirm = signal<PendingConfirm | null>(null);
  readonly confirming = signal(false);
  readonly trackingAppointment = signal<AppointmentResponse | null>(null);
  readonly trackingSaving = signal(false);
  readonly trackingSaved = signal(false);
  readonly trackingError = signal<string | null>(null);
  readonly workStatusOptions = WORK_STATUS_OPTIONS;

  readonly trackingForm = this.fb.nonNullable.group({
    vehicleWorkStatus: ['None', Validators.required],
    estimatedDate: [''],
    estimatedTime: [''],
    trackingNote: [''],
  });

  readonly phoneTelHref = phoneTelHref;
  readonly formatPhoneDisplay = formatPhoneDisplay;

  constructor() {
    effect((onCleanup) => {
      if (!this.trackingAppointment()) return;
      onCleanup(lockAdminOverlay());
    });
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.adminApi
      .getAppointments(this.statusFilter() || undefined, undefined, this.page())
      .subscribe((res) => {
        this.appointments.set(res.items);
        this.total.set(res.totalCount);
      });
  }

  setStatusFilter(status: string) {
    this.statusFilter.set(status);
    this.page.set(1);
    this.load();
  }

  askApprove(id: string) {
    this.pendingConfirm.set({
      id,
      kind: 'approve',
      status: 'Confirmed',
      description: "Müşteriye onay SMS'i ve takip linki gönderilecektir.",
      confirmLabel: 'Onayla',
      confirmVariant: 'primary',
    });
  }

  askReject(id: string) {
    this.pendingConfirm.set({
      id,
      kind: 'reject',
      status: 'Cancelled',
      confirmLabel: 'Reddet',
      confirmVariant: 'danger',
    });
  }

  askStatusChange(id: string, status: string, confirmLabel: string, confirmVariant: 'primary' | 'danger' | 'secondary') {
    this.pendingConfirm.set({
      id,
      kind: 'confirm',
      status,
      confirmLabel,
      confirmVariant,
    });
  }

  closeConfirm() {
    if (this.confirming()) return;
    this.pendingConfirm.set(null);
  }

  submitConfirm() {
    const pending = this.pendingConfirm();
    if (!pending || this.confirming()) return;

    this.confirming.set(true);
    this.adminApi.updateStatus(pending.id, pending.status).subscribe({
      next: () => {
        this.confirming.set(false);
        this.pendingConfirm.set(null);
        this.load();
      },
      error: () => {
        this.confirming.set(false);
      },
    });
  }

  canEditTracking(apt: AppointmentResponse): boolean {
    return apt.status === 'Confirmed' || apt.status === 'Completed' || apt.status === 'Pending';
  }

  openTracking(apt: AppointmentResponse) {
    this.trackingError.set(null);
    this.trackingSaved.set(false);
    this.trackingAppointment.set(apt);

    let estimatedDate = '';
    let estimatedTime = '';
    if (apt.estimatedCompletionAt) {
      const d = new Date(apt.estimatedCompletionAt);
      if (!Number.isNaN(d.getTime())) {
        const pad = (n: number) => String(n).padStart(2, '0');
        estimatedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        estimatedTime = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
    }

    this.trackingForm.reset({
      vehicleWorkStatus: apt.vehicleWorkStatus || 'None',
      estimatedDate,
      estimatedTime,
      trackingNote: apt.trackingNote ?? '',
    });
  }

  closeTracking() {
    if (this.trackingSaving()) return;
    this.trackingAppointment.set(null);
    this.trackingSaved.set(false);
    this.trackingError.set(null);
  }

  saveTracking() {
    const apt = this.trackingAppointment();
    if (!apt || this.trackingSaving()) return;

    const raw = this.trackingForm.getRawValue();
    let estimatedCompletionAt: string | null = null;
    if (raw.estimatedDate) {
      const time = raw.estimatedTime || '12:00';
      const local = new Date(`${raw.estimatedDate}T${time}:00`);
      if (Number.isNaN(local.getTime())) {
        this.trackingError.set('Tahmini bitiş tarihi geçersiz.');
        return;
      }
      estimatedCompletionAt = local.toISOString();
    }

    this.trackingSaving.set(true);
    this.trackingError.set(null);
    this.adminApi
      .updateTracking(apt.id, {
        vehicleWorkStatus: raw.vehicleWorkStatus,
        estimatedCompletionAt,
        trackingNote: raw.trackingNote.trim() || null,
      })
      .subscribe({
        next: () => {
          this.trackingSaving.set(false);
          this.trackingSaved.set(true);
          this.load();
          setTimeout(() => this.closeTracking(), 1200);
        },
        error: (err) => {
          this.trackingSaving.set(false);
          this.trackingError.set(err?.error?.detail ?? 'Takip güncellenemedi.');
        },
      });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      Pending: 'Bekliyor',
      Confirmed: 'Onaylı',
      Completed: 'Tamamlandı',
      Cancelled: 'İptal',
      NoShow: 'Gelmedi',
    };
    return map[status] ?? status;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'admin-badge--pending',
      Confirmed: 'admin-badge--confirmed',
      Completed: 'admin-badge--completed',
      Cancelled: 'admin-badge--cancelled',
      NoShow: 'admin-badge--noshow',
    };
    return map[status] ?? '';
  }

  workStatusLabel(status: string): string {
    return WORK_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
  }

  workStatusClass(status: string): string {
    const map: Record<string, string> = {
      None: 'admin-badge--work-none',
      VehicleReceived: 'admin-badge--work-received',
      InProgress: 'admin-badge--work-progress',
      ReadyForPickup: 'admin-badge--work-ready',
      Delivered: 'admin-badge--work-delivered',
    };
    return map[status] ?? 'admin-badge--work-none';
  }
}
