import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import {
  AnalyticsResponse,
  AppointmentResponse,
  BlockedSlotDto,
  DashboardSummary,
  GalleryItemDto,
  PagedResult,
  PromoBannerAdminDto,
  SmsLogDto,
  UpdatePromoBannerRequest,
  UpdateVehicleTrackingRequest,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly api = inject(ApiService);

  getDashboard() {
    return this.api.get<DashboardSummary>('/admin/dashboard/summary');
  }

  getAppointments(status?: string, date?: string, page = 1, pageSize = 20) {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) params.set('status', status);
    if (date) params.set('date', date);
    return this.api.get<PagedResult<AppointmentResponse>>(`/admin/appointments?${params}`);
  }

  updateStatus(id: string, status: string) {
    return this.api.patch<AppointmentResponse>(`/admin/appointments/${id}/status`, { status });
  }

  updateTracking(id: string, request: UpdateVehicleTrackingRequest) {
    return this.api.patch<AppointmentResponse>(`/admin/appointments/${id}/tracking`, request);
  }

  getAnalytics(from?: string, to?: string) {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const qs = params.toString();
    return this.api.get<AnalyticsResponse>(`/admin/analytics${qs ? `?${qs}` : ''}`);
  }

  sendBulkSms(recipientSource: string, message: string, statusFilter?: string, manualNumbers?: string) {
    return this.api.post<{ success: boolean; resultCode: string; recipientCount: number }>(
      '/admin/sms/bulk',
      { recipientSource, message, statusFilter, manualNumbers }
    );
  }

  getSmsLogs(page = 1) {
    return this.api.get<PagedResult<SmsLogDto>>(`/admin/sms/logs?page=${page}`);
  }

  getBlockedSlots() {
    return this.api.get<BlockedSlotDto[]>('/admin/blocked-slots');
  }

  createBlockedSlot(date: string, timeSlot: string | null, reason?: string) {
    return this.api.post<BlockedSlotDto>('/admin/blocked-slots', { date, timeSlot, reason });
  }

  deleteBlockedSlot(id: number) {
    return this.api.delete(`/admin/blocked-slots/${id}`);
  }

  getGallery() {
    return this.api.get<GalleryItemDto[]>('/admin/gallery');
  }

  createGalleryItem(formData: FormData) {
    return this.api.postForm<GalleryItemDto>('/admin/gallery', formData);
  }

  updateGalleryItem(id: number, formData: FormData) {
    return this.api.putForm<GalleryItemDto>(`/admin/gallery/${id}`, formData);
  }

  deleteGalleryItem(id: number) {
    return this.api.delete(`/admin/gallery/${id}`);
  }

  getPromoBanner() {
    return this.api.get<PromoBannerAdminDto>('/admin/promo-banner');
  }

  updatePromoBanner(request: UpdatePromoBannerRequest) {
    return this.api.put<PromoBannerAdminDto>('/admin/promo-banner', request);
  }
}
