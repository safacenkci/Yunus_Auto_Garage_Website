using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Services;

public class NetgsmSmsService(
    AppDbContext db,
    IOptions<NetgsmOptions> netgsmOptions,
    IHttpClientFactory httpClientFactory,
    ILogger<NetgsmSmsService> logger) : ISmsService
{
    private readonly NetgsmOptions _options = netgsmOptions.Value;

    public Task SendAdminNewAppointmentNotificationAsync(Appointment appointment, string serviceName, CancellationToken ct = default)
    {
        var message =
            $"Yeni randevu: {appointment.FullName} {appointment.Date:dd.MM.yyyy} {appointment.TimeSlot} — {serviceName}. Tel: {appointment.Phone}";
        return SendAsync([_options.AdminPhone], message, SmsType.AdminNotification, ct);
    }

    public Task SendCustomerConfirmationAsync(Appointment appointment, string trackingUrl, CancellationToken ct = default)
    {
        var message =
            $"Sayın {appointment.FullName}, {appointment.Date:dd.MM.yyyy} {appointment.TimeSlot} randevunuz onaylanmıştır. Araç durumunuzu takip edin: {trackingUrl} Yunus Auto Garage";
        return SendAsync([appointment.Phone], message, SmsType.CustomerConfirmation, ct);
    }

    public Task SendReminderAsync(Appointment appointment, CancellationToken ct = default)
    {
        var message =
            $"Sayın {appointment.FullName}, yarın {appointment.TimeSlot} randevunuz bulunmaktadır. Yunus Auto Garage";
        return SendAsync([appointment.Phone], message, SmsType.Reminder, ct);
    }

    public Task SendTrackingUpdateAsync(Appointment appointment, string trackingUrl, CancellationToken ct = default)
    {
        var statusLabel = TrackingService.StatusLabel(appointment.VehicleWorkStatus);
        var eta = appointment.EstimatedCompletionAt.HasValue
            ? FormatIstanbul(appointment.EstimatedCompletionAt.Value)
            : "—";
        var message =
            $"Sayın {appointment.FullName}, aracınızın durumu: {statusLabel}. Tahmini bitiş: {eta} Detay: {trackingUrl} Yunus Auto Garage";
        return SendAsync([appointment.Phone], message, SmsType.TrackingUpdate, ct);
    }

    private static string FormatIstanbul(DateTime utcOrUnspecified)
    {
        var utc = utcOrUnspecified.Kind switch
        {
            DateTimeKind.Utc => utcOrUnspecified,
            DateTimeKind.Local => utcOrUnspecified.ToUniversalTime(),
            _ => DateTime.SpecifyKind(utcOrUnspecified, DateTimeKind.Utc)
        };

        TimeZoneInfo tz;
        try
        {
            tz = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
        }
        catch (TimeZoneNotFoundException)
        {
            tz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");
        }

        return TimeZoneInfo.ConvertTimeFromUtc(utc, tz).ToString("dd.MM.yyyy HH:mm");
    }

    public async Task<(bool Success, string ResultCode, int RecipientCount)> SendBulkAsync(
        IReadOnlyList<string> phones,
        string message,
        CancellationToken ct = default)
    {
        if (phones.Count == 0)
        {
            return (false, "EMPTY", 0);
        }

        await SendAsync(phones, message, SmsType.Bulk, ct);
        var lastLog = await db.SmsLogs.OrderByDescending(l => l.Id).FirstOrDefaultAsync(ct);
        return (lastLog?.Success ?? false, lastLog?.ResultCode ?? "UNKNOWN", phones.Count);
    }

    private async Task SendAsync(IReadOnlyList<string> phones, string message, SmsType type, CancellationToken ct)
    {
        var normalizedPhones = phones
            .Where(p => !string.IsNullOrWhiteSpace(p))
            .Select(PhoneNormalizer.Normalize)
            .Distinct()
            .ToList();

        if (normalizedPhones.Count == 0)
        {
            return;
        }

        if (!_options.Enabled)
        {
            await LogSmsAsync(normalizedPhones, message, type, null, "SIMULATED", true, ct);
            logger.LogInformation("SMS simulated ({Type}): {Message}", type, message);
            return;
        }

        try
        {
            var client = httpClientFactory.CreateClient("Netgsm");
            var credentials = Convert.ToBase64String(
                Encoding.UTF8.GetBytes($"{_options.UserCode}:{_options.Password}"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentials);

            var payload = new
            {
                msgheader = _options.MsgHeader,
                encoding = "TR",
                messages = normalizedPhones.Select(p => new { msg = message, no = p }).ToArray()
            };

            var response = await client.PostAsJsonAsync(
                "https://api.netgsm.com.tr/sms/rest/v2/send",
                payload,
                ct);

            var body = await response.Content.ReadAsStringAsync(ct);
            var resultCode = "HTTP_ERROR";
            string? jobId = null;
            var success = false;

            if (response.IsSuccessStatusCode)
            {
                using var doc = JsonDocument.Parse(body);
                if (doc.RootElement.TryGetProperty("code", out var codeEl))
                {
                    resultCode = codeEl.GetString() ?? "UNKNOWN";
                    success = resultCode == "00";
                }

                if (doc.RootElement.TryGetProperty("jobid", out var jobEl))
                {
                    jobId = jobEl.GetString();
                }
            }

            await LogSmsAsync(normalizedPhones, message, type, jobId, resultCode, success, ct);

            if (!success)
            {
                logger.LogWarning("NetGSM SMS failed ({Type}): code={Code}, body={Body}", type, resultCode, body);
            }
        }
        catch (Exception ex)
        {
            await LogSmsAsync(normalizedPhones, message, type, null, "EXCEPTION", false, ct);
            logger.LogError(ex, "NetGSM SMS exception ({Type})", type);
        }
    }

    private async Task LogSmsAsync(
        IReadOnlyList<string> phones,
        string message,
        SmsType type,
        string? jobId,
        string resultCode,
        bool success,
        CancellationToken ct)
    {
        db.SmsLogs.Add(new SmsLog
        {
            Recipients = string.Join(",", phones),
            RecipientCount = phones.Count,
            Message = message,
            Type = type,
            NetgsmJobId = jobId,
            ResultCode = resultCode,
            Success = success,
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync(ct);
    }
}
