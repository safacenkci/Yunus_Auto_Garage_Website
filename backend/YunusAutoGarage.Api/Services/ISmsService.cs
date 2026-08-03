using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Services;

public interface ISmsService
{
    Task SendAdminNewAppointmentNotificationAsync(Appointment appointment, string serviceName, CancellationToken ct = default);
    Task SendCustomerConfirmationAsync(Appointment appointment, string trackingUrl, CancellationToken ct = default);
    Task SendReminderAsync(Appointment appointment, CancellationToken ct = default);
    Task SendTrackingUpdateAsync(Appointment appointment, string trackingUrl, CancellationToken ct = default);
    Task<(bool Success, string ResultCode, int RecipientCount)> SendBulkAsync(
        IReadOnlyList<string> phones,
        string message,
        CancellationToken ct = default);
}
