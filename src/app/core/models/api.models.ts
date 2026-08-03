export interface ServiceDto {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export interface SlotDto {
  time: string;
  available: boolean;
}

export interface CreateAppointmentRequest {
  fullName: string;
  phone: string;
  serviceId: number;
  vehicleMake: string;
  vehicleModel: string;
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
  licensePlate: string | null;
  serviceId: number;
  serviceName: string;
  date: string;
  timeSlot: string;
  note: string | null;
  status: string;
  createdAt: string;
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
  mediaType: 'Photo' | 'Video';
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
