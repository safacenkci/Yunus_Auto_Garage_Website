import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PromoBannerDto } from '../../core/models/api.models';
import { PromoBannerService } from '../../core/services/promo-banner.service';
import { ScrollService } from '../../core/services/scroll.service';
import { SITE_CONFIG, SITE_NAV_SECTIONS } from '../../site-config';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
})
export class SiteHeader implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly scrollService = inject(ScrollService);
  private readonly promoBannerService = inject(PromoBannerService);
  private readonly headerRef = viewChild<ElementRef<HTMLElement>>('headerRef');
  private resizeObserver?: ResizeObserver;

  readonly config = SITE_CONFIG;
  readonly navSections = SITE_NAV_SECTIONS;
  readonly phoneHref = `tel:+90${SITE_CONFIG.PHONE_DIGITS}`;
  readonly whatsappHref = `https://wa.me/90${SITE_CONFIG.WHATSAPP_DIGITS}?text=Merhaba%2C%20oto%20elektrik%20hizmeti%20i%C3%A7in%20yard%C4%B1m%20istiyorum.`;
  readonly mobileMenuOpen = signal(false);
  readonly promo = signal<PromoBannerDto | null>(null);
  private lockedScrollY = 0;

  constructor() {
    afterNextRender(() => {
      this.promoBannerService.getActive().subscribe({
        next: (banner) => {
          this.promo.set(banner);
          requestAnimationFrame(() => this.syncHeaderHeight());
        },
        error: () => this.promo.set(null),
      });
    });
  }

  isInternalLink(link: string | null | undefined): boolean {
    return !!link && link.startsWith('/') && !link.startsWith('//');
  }

  isExternalHttpLink(link: string | null | undefined): boolean {
    if (!link) return false;
    return /^https?:\/\//i.test(link);
  }

  toggleMobileMenu() {
    this.setMobileMenuOpen(!this.mobileMenuOpen());
  }

  closeMobileMenu() {
    this.setMobileMenuOpen(false);
  }

  private setMobileMenuOpen(open: boolean) {
    if (this.mobileMenuOpen() === open) return;
    this.mobileMenuOpen.set(open);
    if (!isPlatformBrowser(this.platformId)) return;

    document.body.classList.toggle('mobile-menu-open', open);

    if (open) {
      this.lockedScrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.lockedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      return;
    }

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, this.lockedScrollY);
  }

  menuToggleLabel(): string {
    return this.mobileMenuOpen() ? 'Menüyü kapat' : 'Menüyü aç';
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.syncHeaderHeight();

    const header = this.headerRef()?.nativeElement;
    if (!header || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.syncHeaderHeight());
    this.resizeObserver.observe(header);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.closeMobileMenu();
  }

  navigateToSection(event: Event, fragment: string) {
    event.preventDefault();
    this.closeMobileMenu();
    this.scrollService.navigateToHomeSection(fragment);
  }

  navigateToTop(event: Event) {
    event.preventDefault();
    this.closeMobileMenu();
    this.scrollService.navigateToTop();
  }

  private syncHeaderHeight() {
    this.scrollService.syncHeaderHeight();
  }
}
