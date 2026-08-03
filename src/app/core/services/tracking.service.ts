import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { TrackingResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private readonly api = inject(ApiService);

  getByToken(token: string) {
    return this.api.get<TrackingResponse>(`/tracking/${encodeURIComponent(token)}`);
  }
}
