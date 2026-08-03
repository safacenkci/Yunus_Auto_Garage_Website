import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { SITE_CONFIG } from '../../site-config';

@Component({
  selector: 'app-mobile-contact-fab',
  styles: [
    `
      :host {
        position: fixed;
        right: 1rem;
        bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
        z-index: 40;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        pointer-events: none;
      }

      :host-context(body.mobile-menu-open),
      :host-context(body.lightbox-open) {
        display: none !important;
      }

      @media (min-width: 768px) {
        :host {
          display: none !important;
        }
      }

      .mobile-contact-fab__btn {
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        height: 3.5rem;
        min-width: 3.5rem;
        min-height: 3.5rem;
        border-radius: 9999px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
        transition: transform 0.2s ease;
      }

      .mobile-contact-fab__btn:active {
        transform: scale(0.95);
      }

      .mobile-contact-fab__btn--call {
        background: #000000;
        color: #ffffff;
      }

      .mobile-contact-fab__btn--whatsapp {
        background: #25d366;
        color: #ffffff;
      }

      .mobile-contact-fab__icon {
        width: 1.75rem;
        height: 1.75rem;
        fill: currentColor;
      }
    `,
  ],
  template: `
    <a
      [href]="whatsappHref"
      class="mobile-contact-fab__btn mobile-contact-fab__btn--whatsapp"
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp ile yaz"
    >
      <svg class="mobile-contact-fab__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        />
      </svg>
    </a>
    <a
      [href]="phoneHref"
      class="mobile-contact-fab__btn mobile-contact-fab__btn--call"
      aria-label="Acil arama"
    >
      <span class="material-symbols-outlined filled-icon" style="font-size: 1.75rem">call</span>
    </a>
  `,
})
export class MobileContactFab implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly phoneHref = `tel:+90${SITE_CONFIG.PHONE_DIGITS}`;
  readonly whatsappHref = `https://wa.me/90${SITE_CONFIG.WHATSAPP_DIGITS}?text=Merhaba%2C%20oto%20elektrik%20hizmeti%20i%C3%A7in%20yard%C4%B1m%20istiyorum.`;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.appendChild(this.host.nativeElement);
    }
  }

  ngOnDestroy() {
    this.host.nativeElement.remove();
  }
}
