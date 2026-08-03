import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { AppointmentResponse } from '../../../core/models/api.models';
import { AdminConfirmModalComponent } from '../../shared/admin-confirm-modal.component';
import { AdminConfirmKind } from '../../shared/admin-confirm.types';

type PendingConfirm = {
  id: string;
  kind: AdminConfirmKind;
  status: string;
  description?: string;
  confirmLabel: string;
  confirmVariant: 'primary' | 'danger' | 'secondary';
};

@Component({
  selector: 'app-appointments',
  imports: [AdminConfirmModalComponent],
  templateUrl: './appointments.html',
})
export class AppointmentsComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);

  readonly appointments = signal<AppointmentResponse[]>([]);
  readonly total = signal(0);
  readonly statusFilter = signal('');
  readonly page = signal(1);
  readonly pendingConfirm = signal<PendingConfirm | null>(null);
  readonly confirming = signal(false);

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
}
