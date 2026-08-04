import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { DashboardSummary } from '../../../core/models/api.models';
import {
  APPOINTMENT_STATUS_BADGES,
  APPOINTMENT_STATUS_LABELS,
  type AppointmentStatus,
} from '../../../core/models/api-contract';
import { AdminConfirmModalComponent } from '../../shared/admin-confirm-modal.component';
import { AdminConfirmKind } from '../../shared/admin-confirm.types';

type PendingConfirm = {
  id: string;
  kind: AdminConfirmKind;
  status: AppointmentStatus;
  description?: string;
  confirmLabel: string;
  confirmVariant: 'primary' | 'danger';
};

@Component({
  selector: 'app-dashboard',
  imports: [AdminConfirmModalComponent],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  readonly summary = signal<DashboardSummary | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly pendingConfirm = signal<PendingConfirm | null>(null);
  readonly confirming = signal(false);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(false);
    this.adminApi.getDashboard().subscribe({
      next: (s) => {
        this.summary.set(s);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  askApprove(id: string) {
    this.pendingConfirm.set({
      id,
      kind: 'approve',
      status: 'Confirmed',
      description: "Müşteriye onay SMS'i gönderilecektir.",
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

  isPending(status: AppointmentStatus): boolean {
    return status === 'Pending';
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

  statusLabel(status: AppointmentStatus): string {
    return APPOINTMENT_STATUS_LABELS[status] ?? status;
  }

  statusClass(status: AppointmentStatus): string {
    return APPOINTMENT_STATUS_BADGES[status] ?? '';
  }
}
