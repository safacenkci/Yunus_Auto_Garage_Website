import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { VehicleCategoryDto, VehicleMakeDto, VehicleModelDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly api = inject(ApiService);

  getCategories() {
    return this.api.get<VehicleCategoryDto[]>('/vehicles/categories');
  }

  getMakes(category: string) {
    return this.api.get<VehicleMakeDto[]>(`/vehicles/makes?category=${encodeURIComponent(category)}`);
  }

  getModels(makeId: number) {
    return this.api.get<VehicleModelDto[]>(`/vehicles/models?makeId=${makeId}`);
  }
}
