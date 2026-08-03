import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  ADMIN_MOBILE_PRIMARY_ROUTES,
  ADMIN_NAV_GROUPS,
  AdminNavItem,
} from './admin-nav.config';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private readonly auth = inject(AuthService);

  readonly navGroups = ADMIN_NAV_GROUPS;
  readonly mobilePrimaryNav = this.flattenNavItems().filter((item) =>
    ADMIN_MOBILE_PRIMARY_ROUTES.includes(item.route as (typeof ADMIN_MOBILE_PRIMARY_ROUTES)[number]),
  );

  readonly mobileMenuOpen = signal(false);

  logout() {
    this.auth.clearToken();
    window.location.href = '/admin/login';
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  private flattenNavItems(): AdminNavItem[] {
    return this.navGroups.flatMap((group) => group.items);
  }
}
