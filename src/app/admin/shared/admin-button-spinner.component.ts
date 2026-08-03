import { Component, computed, input } from '@angular/core';

export type AdminSpinnerVariant = 'inherit' | 'light' | 'dark' | 'gold';

@Component({
  selector: 'app-admin-button-spinner',
  template: `<span class="admin-spinner-ring" [class]="variantClass()" aria-hidden="true"></span>`,
})
export class AdminButtonSpinnerComponent {
  readonly variant = input<AdminSpinnerVariant>('inherit');

  readonly variantClass = computed(() => {
    const variant = this.variant();
    if (variant === 'light') return 'admin-spinner-ring--light';
    if (variant === 'dark') return 'admin-spinner-ring--dark';
    if (variant === 'gold') return 'admin-spinner-ring--gold';
    return '';
  });
}
