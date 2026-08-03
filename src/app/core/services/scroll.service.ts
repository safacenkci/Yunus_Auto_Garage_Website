import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HOME_SECTION_IDS } from '../../site-config';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  /** Promo banner + main nav row (excludes expandable mobile menu). */
  getHeaderOffset(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return 120;
    }

    const promo = this.document.querySelector<HTMLElement>('[data-header-promo]');
    const nav = this.document.querySelector<HTMLElement>('[data-header-nav]');

    if (promo && nav) {
      return promo.offsetHeight + nav.offsetHeight;
    }

    const header = this.document.querySelector<HTMLElement>('header');
    return header?.offsetHeight ?? 120;
  }

  syncHeaderHeight(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.documentElement.style.setProperty('--header-height', `${this.getHeaderOffset()}px`);
  }

  isHomeSection(fragment: string): boolean {
    return HOME_SECTION_IDS.includes(fragment);
  }

  scrollToSection(fragment: string, smooth = true): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const target = this.document.getElementById(fragment);
    const view = this.document.defaultView;
    if (!target || !view) {
      return;
    }

    const top = target.getBoundingClientRect().top + view.scrollY - this.getHeaderOffset();

    view.scrollTo({
      top: Math.max(0, top),
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  scrollToSectionWhenReady(fragment: string, smooth = false, maxAttempts = 24): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const attempt = (remaining: number) => {
      const target = this.document.getElementById(fragment);
      if (target || remaining <= 0) {
        this.scrollToSection(fragment, smooth && remaining === maxAttempts);
        return;
      }

      requestAnimationFrame(() => attempt(remaining - 1));
    };

    attempt(maxAttempts);
  }

  scrollToTop(smooth = true): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.defaultView?.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  navigateToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const scroll = () => this.scrollToTop(this.isOnHomeRoute());

    if (this.isOnHomeRoute()) {
      scroll();
      if (this.getCurrentFragment()) {
        void this.router.navigate(['/'], { replaceUrl: true });
      }
      return;
    }

    void this.router.navigate(['/']).then(() => scroll());
  }

  navigateToHomeSection(fragment: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (fragment === 'randevu') {
      void this.router.navigate(['/randevu']);
      return;
    }

    if (!this.isHomeSection(fragment)) {
      return;
    }

    const scroll = () => {
      this.scrollToSectionWhenReady(fragment);
    };

    const onHome = this.isOnHomeRoute();
    const currentFragment = this.getCurrentFragment();

    if (onHome && currentFragment === fragment) {
      scroll();
      return;
    }

    void this.router.navigate(['/'], { fragment }).then(() => {
      if (onHome) {
        scroll();
        return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => this.scrollToSectionWhenReady(fragment));
      });
    });
  }

  private isOnHomeRoute(): boolean {
    const path = this.router.url.split(/[?#]/)[0];
    return path === '' || path === '/';
  }

  private getCurrentFragment(): string {
    const parsed = this.router.parseUrl(this.router.url);
    if (parsed.fragment) {
      return parsed.fragment;
    }

    if (isPlatformBrowser(this.platformId)) {
      return this.document.defaultView?.location.hash.slice(1) ?? '';
    }

    return '';
  }
}
