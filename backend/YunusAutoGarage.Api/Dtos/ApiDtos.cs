namespace YunusAutoGarage.Api.Dtos;

public record ServiceDto(
    int Id,
    string Code,
    string Name,
    string Icon,
    string Description,
    string BookingMode,
    IReadOnlyList<string> Options
);

public record SlotDto(string Time, bool Available);

public record CreateAppointmentRequest(
    string FullName,
    string Phone,
    int ServiceId,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string Date,
    string TimeSlot,
    string? Note,
    IReadOnlyList<string>? SelectedOptions,
    bool KvkkConsent
);

public record AppointmentResponse(
    Guid Id,
    string FullName,
    string Phone,
    string VehicleMake,
    string VehicleModel,
    int? VehicleYear,
    string? LicensePlate,
    int ServiceId,
    string ServiceName,
    string Date,
    string TimeSlot,
    string? Note,
    string Status,
    DateTime CreatedAt,
    string TrackingToken,
    string VehicleWorkStatus,
    DateTime? EstimatedCompletionAt,
    string? TrackingNote
);

public record UpdateVehicleTrackingRequest(
    string VehicleWorkStatus,
    DateTime? EstimatedCompletionAt,
    string? TrackingNote
);

public record TrackingTimelineStepDto(
    string Status,
    string Label,
    DateTime? CompletedAt,
    bool IsCurrent,
    bool IsCompleted
);

public record TrackingResponse(
    string VehicleMake,
    string VehicleModel,
    int? VehicleYear,
    string? LicensePlate,
    string ServiceName,
    string AppointmentDate,
    string TimeSlot,
    string AppointmentStatus,
    string VehicleWorkStatus,
    string VehicleWorkStatusLabel,
    DateTime? EstimatedCompletionAt,
    string? TrackingNote,
    IReadOnlyList<TrackingTimelineStepDto> Timeline
);

public record LoginRequest(string Username, string Password);

public record LoginResponse(string Token, DateTime ExpiresAt);

public record UpdateStatusRequest(string Status);

public record DashboardSummaryDto(
    int TodayAppointments,
    int PendingCount,
    int WeeklyViews,
    int TotalAppointments,
    IReadOnlyList<AppointmentResponse> RecentAppointments
);

public record AnalyticsDayDto(string Date, int Views, int UniqueVisitors);

public record TopPageDto(string Path, int Views);

public record AnalyticsResponseDto(
    IReadOnlyList<AnalyticsDayDto> DailySeries,
    IReadOnlyList<TopPageDto> TopPages,
    int TotalAppointments
);

public record TrackRequest(string Path, string VisitorId, string? Referrer);

public record BulkSmsRequest(
    string RecipientSource,
    string? StatusFilter,
    string? ManualNumbers,
    string Message
);

public record SmsLogDto(
    long Id,
    string Type,
    int RecipientCount,
    string Message,
    string ResultCode,
    bool Success,
    DateTime CreatedAt
);

public record BlockedSlotDto(int Id, string Date, string? TimeSlot, string? Reason);

public record CreateBlockedSlotRequest(string Date, string? TimeSlot, string? Reason);

public record PagedResult<T>(IReadOnlyList<T> Items, int TotalCount, int Page, int PageSize);

public record GalleryItemDto(
    int Id,
    string? Title,
    string MediaType,
    string MediaUrl,
    bool IsActive,
    int SortOrder,
    DateTime CreatedAt
);

public record PromoBannerDto(string MessageText, string? CtaText, string? CtaLink);

public record PromoBannerAdminDto(
    bool IsEnabled,
    string MessageText,
    string? CtaText,
    string? CtaLink,
    DateTime UpdatedAt
);

public record UpdatePromoBannerRequest(
    bool IsEnabled,
    string MessageText,
    string? CtaText,
    string? CtaLink
);

public record VehicleCategoryDto(string Id, string Name);

public record VehicleMakeDto(int Id, string Name);

public record VehicleModelDto(int Id, string Name);
