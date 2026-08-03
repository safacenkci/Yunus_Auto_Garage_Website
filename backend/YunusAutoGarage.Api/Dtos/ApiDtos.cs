namespace YunusAutoGarage.Api.Dtos;

public record ServiceDto(int Id, string Name, string Icon, string Description);

public record SlotDto(string Time, bool Available);

public record CreateAppointmentRequest(
    string FullName,
    string Phone,
    int ServiceId,
    string VehicleMake,
    string VehicleModel,
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
    string? LicensePlate,
    int ServiceId,
    string ServiceName,
    string Date,
    string TimeSlot,
    string? Note,
    string Status,
    DateTime CreatedAt
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
