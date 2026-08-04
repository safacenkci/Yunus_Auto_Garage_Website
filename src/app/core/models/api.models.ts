import type {
  AppointmentStatus,
  BookingServiceMode,
  GalleryMediaType,
  VehicleWorkStatus,
} from './api-contract';

export interface ServiceDto {
  id: number;
  code: string;
  name: string;
  icon: string;
  description: string;
  bookingMode: BookingServiceMode;
  options: string[];
}

export interface SlotDto {
  time: string;
  available: boolean;
}

export interface VehicleCategoryDto {
  id: string;
  name: string;
}

export interface VehicleMakeDto {
  id: number;
  name: string;
}

export interface VehicleModelDto {
  id: number;
  name: string;
}

export interface CreateAppointmentRequest {
  fullName: string;
  phone: string;
  serviceId: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  date: string;
  timeSlot: string;
  note?: string;
  selectedOptions?: string[];
  kvkkConsent: boolean;
}

export interface AppointmentResponse {
  id: string;
  fullName: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number | null;
  licensePlate: string | null;
  serviceId: number;
  serviceName: string;
  date: string;
  timeSlot: string;
  note: string | null;
  status: AppointmentStatus;
  createdAt: string;
  trackingToken: string;
  vehicleWorkStatus: VehicleWorkStatus;
  estimatedCompletionAt: string | null;
  trackingNote: string | null;
}

export interface UpdateVehicleTrackingRequest {
  vehicleWorkStatus: VehicleWorkStatus;
  estimatedCompletionAt?: string | null;
  trackingNote?: string | null;
}

export interface TrackingTimelineStepDto {
  status: VehicleWorkStatus;
  label: string;
  completedAt: string | null;
  isCurrent: boolean;
  isCompleted: boolean;
}

export interface TrackingResponse {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number | null;
  licensePlate: string | null;
  serviceName: string;
  appointmentDate: string;
  timeSlot: string;
  appointmentStatus: AppointmentStatus;
  vehicleWorkStatus: VehicleWorkStatus;
  vehicleWorkStatusLabel: string;
  estimatedCompletionAt: string | null;
  trackingNote: string | null;
  timeline: TrackingTimelineStepDto[];
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface DashboardSummary {
  todayAppointments: number;
  pendingCount: number;
  weeklyViews: number;
  totalAppointments: number;
  recentAppointments: AppointmentResponse[];
}

export interface AnalyticsDay {
  date: string;
  views: number;
  uniqueVisitors: number;
}

export interface TopPage {
  path: string;
  views: number;
}

export interface AnalyticsResponse {
  dailySeries: AnalyticsDay[];
  topPages: TopPage[];
  totalAppointments: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SmsLogDto {
  id: number;
  type: string;
  recipientCount: number;
  message: string;
  resultCode: string;
  success: boolean;
  createdAt: string;
}

export interface BlockedSlotDto {
  id: number;
  date: string;
  timeSlot: string | null;
  reason: string | null;
}

export interface GalleryItemDto {
  id: number;
  title: string | null;
  mediaType: GalleryMediaType;
  mediaUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface PromoBannerDto {
  messageText: string;
  ctaText: string | null;
  ctaLink: string | null;
}

export interface PromoBannerAdminDto extends PromoBannerDto {
  isEnabled: boolean;
  updatedAt: string;
}

export interface UpdatePromoBannerRequest {
  isEnabled: boolean;
  messageText: string;
  ctaText?: string | null;
  ctaLink?: string | null;
}
