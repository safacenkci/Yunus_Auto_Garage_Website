import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileContactFab } from '../mobile-contact-fab/mobile-contact-fab';
import { SiteFooter } from '../site-footer/site-footer';
import { SiteHeader } from '../site-header/site-header';

@Component({
  selector: 'app-site-layout',
  imports: [RouterOutlet, SiteHeader, SiteFooter, MobileContactFab],
  template: `
    <div class="bg-background text-on-background antialiased min-h-screen flex flex-col pt-[var(--header-height)]">
      <app-site-header />
      <main class="flex-grow flex flex-col pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <router-outlet />
      </main>
      <app-site-footer />
    </div>
    <app-mobile-contact-fab />
  `,
})
export class SiteLayout {}
