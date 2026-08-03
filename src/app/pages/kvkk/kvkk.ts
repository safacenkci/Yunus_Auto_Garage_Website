import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONFIG } from '../../site-config';

@Component({
  selector: 'app-kvkk',
  imports: [RouterLink],
  templateUrl: './kvkk.html',
})
export class KvkkComponent {
  readonly config = SITE_CONFIG;
  readonly phoneHref = `tel:+90${SITE_CONFIG.PHONE_DIGITS}`;
}
