import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../../core/services/scroll.service';
import { SITE_CONFIG, SITE_NAV_SECTIONS } from '../../site-config';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  private readonly scrollService = inject(ScrollService);

  readonly config = SITE_CONFIG;
  readonly navSections = SITE_NAV_SECTIONS;
  readonly currentYear = new Date().getFullYear();

  navigateToSection(event: Event, fragment: string) {
    event.preventDefault();
    this.scrollService.navigateToHomeSection(fragment);
  }
}
