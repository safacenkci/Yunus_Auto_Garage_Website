import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { GalleryItemDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly api = inject(ApiService);

  getItems() {
    return this.api.get<GalleryItemDto[]>('/gallery');
  }
}
