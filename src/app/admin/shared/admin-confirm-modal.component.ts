import { Component, computed, effect, input, output } from '@angular/core';
import { ADMIN_CONFIRM_MESSAGES, AdminConfirmKind } from './admin-confirm.types';
import { AdminButtonSpinnerComponent } from './admin-button-spinner.component';
import { lockAdminOverlay } from './admin-overlay-lock';

export type AdminConfirmVariant = 'primary' | 'danger' | 'secondary';

@Component({
  selector: 'app-admin-confirm-modal',
  imports: [AdminButtonSpinnerComponent],
  templateUrl: './admin-confirm-modal.component.html',
})
export class AdminConfirmModalComponent {
  readonly open = input(false);
  readonly kind = input<AdminConfirmKind>('confirm');
  readonly title = input<string | undefined>();
  readonly description = input<string | undefined>();
  readonly confirmLabel = input('Onayla');
  readonly confirmVariant = input<AdminConfirmVariant>('primary');
  readonly loading = input(false);

  readonly cancelled = output<void>();
  readonly confirmed = output<void>();

  constructor() {
    effect((onCleanup) => {
      if (!this.open()) return;
      onCleanup(lockAdminOverlay());
    });
  }

  readonly resolvedTitle = computed(() => this.title() ?? ADMIN_CONFIRM_MESSAGES[this.kind()]);

  readonly confirmButtonClass = computed(() => {
    const variant = this.confirmVariant();
    const base = 'admin-btn';
    const loading = this.loading() ? ' admin-btn--loading' : '';
    if (variant === 'danger') {
      return `${base} admin-btn--danger${loading}`;
    }
    if (variant === 'secondary') {
      return `${base} admin-btn--secondary${loading}`;
    }
    return `${base} admin-btn--primary${loading}`;
  });

  readonly spinnerVariant = computed(() => {
    const variant = this.confirmVariant();
    if (variant === 'primary') return 'light' as const;
    return 'dark' as const;
  });

  onCancel() {
    if (this.loading()) return;
    this.cancelled.emit();
  }

  onConfirm() {
    if (this.loading()) return;
    this.confirmed.emit();
  }
}
