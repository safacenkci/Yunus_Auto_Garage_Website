import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { PromoBannerDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class PromoBannerService {
  private readonly api = inject(ApiService);

  getActive() {
    return this.api.get<PromoBannerDto | null>('/promo-banner');
  }
}
