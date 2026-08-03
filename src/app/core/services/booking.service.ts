import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import {
  AppointmentResponse,
  CreateAppointmentRequest,
  ServiceDto,
  SlotDto,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly api = inject(ApiService);

  getServices() {
    return this.api.get<ServiceDto[]>('/services');
  }

  getSlots(date: string) {
    return this.api.get<SlotDto[]>(`/appointments/slots?date=${date}`);
  }

  createAppointment(request: CreateAppointmentRequest) {
    return this.api.post<AppointmentResponse>('/appointments', request);
  }
}
