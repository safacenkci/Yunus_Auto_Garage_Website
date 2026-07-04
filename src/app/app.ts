import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SITE_CONFIG } from './site-config';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private sanitizer = inject(DomSanitizer);

  readonly config = SITE_CONFIG;
  readonly currentYear = new Date().getFullYear();
  readonly phoneHref = `tel:+90${SITE_CONFIG.PHONE_DIGITS}`;
  readonly whatsappHref = `https://wa.me/90${SITE_CONFIG.WHATSAPP_DIGITS}?text=Merhaba%2C%20oto%20elektrik%20hizmeti%20i%C3%A7in%20yard%C4%B1m%20istiyorum.`;
  readonly directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE_CONFIG.MAPS_QUERY)}`;
  readonly safeMapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.google.com/maps?q=${encodeURIComponent(SITE_CONFIG.MAPS_QUERY)}&output=embed`
  );

  readonly mapLoaded = signal(false);

  loadMap() {
    this.mapLoaded.set(true);
  }
}
