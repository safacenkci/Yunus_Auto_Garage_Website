export const BOOKING_SERVICE_MODES = ['options', 'note'] as const;
export type BookingServiceMode = (typeof BOOKING_SERVICE_MODES)[number];

export const APPOINTMENT_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'NoShow'] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  Pending: 'Bekliyor',
  Confirmed: 'Onaylı',
  Completed: 'Tamamlandı',
  Cancelled: 'İptal',
  NoShow: 'Gelmedi',
};

export const APPOINTMENT_STATUS_BADGES: Record<AppointmentStatus, string> = {
  Pending: 'admin-badge--pending',
  Confirmed: 'admin-badge--confirmed',
  Completed: 'admin-badge--completed',
  Cancelled: 'admin-badge--cancelled',
  NoShow: 'admin-badge--noshow',
};

export const VEHICLE_WORK_STATUSES = [
  'None',
  'VehicleReceived',
  'InProgress',
  'ReadyForPickup',
  'Delivered',
] as const;
export type VehicleWorkStatus = (typeof VEHICLE_WORK_STATUSES)[number];

export const VEHICLE_WORK_STATUS_LABELS: Record<VehicleWorkStatus, string> = {
  None: 'Henüz işlem başlamadı',
  VehicleReceived: 'Araç Teslim Alındı',
  InProgress: 'İşleme Başlandı',
  ReadyForPickup: 'Teslime Hazır',
  Delivered: 'Teslim Edildi',
};

export const VEHICLE_WORK_STATUS_BADGES: Record<VehicleWorkStatus, string> = {
  None: 'admin-badge--work-none',
  VehicleReceived: 'admin-badge--work-received',
  InProgress: 'admin-badge--work-progress',
  ReadyForPickup: 'admin-badge--work-ready',
  Delivered: 'admin-badge--work-delivered',
};

export const GALLERY_MEDIA_TYPES = ['Photo', 'Video'] as const;
export type GalleryMediaType = (typeof GALLERY_MEDIA_TYPES)[number];

export const SMS_RECIPIENT_SOURCES = ['all', 'status', 'manual'] as const;
export type SmsRecipientSource = (typeof SMS_RECIPIENT_SOURCES)[number];

export type BulkSmsResult = {
  success: boolean;
  resultCode: string;
  recipientCount: number;
};
