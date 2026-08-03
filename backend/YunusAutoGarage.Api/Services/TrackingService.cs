using Microsoft.EntityFrameworkCore;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Dtos;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Services;

public class TrackingService(AppDbContext db)
{
    private static readonly (VehicleWorkStatus Status, string Label)[] Steps =
    [
        (VehicleWorkStatus.VehicleReceived, "Araç Teslim Alındı"),
        (VehicleWorkStatus.InProgress, "İşleme Başlandı"),
        (VehicleWorkStatus.ReadyForPickup, "Teslime Hazır"),
        (VehicleWorkStatus.Delivered, "Teslim Edildi")
    ];

    public static string StatusLabel(VehicleWorkStatus status) => status switch
    {
        VehicleWorkStatus.None => "Henüz işlem başlamadı",
        VehicleWorkStatus.VehicleReceived => "Araç Teslim Alındı",
        VehicleWorkStatus.InProgress => "İşleme Başlandı",
        VehicleWorkStatus.ReadyForPickup => "Teslime Hazır",
        VehicleWorkStatus.Delivered => "Teslim Edildi",
        _ => status.ToString()
    };

    public static string GenerateTrackingToken() => Guid.NewGuid().ToString("N");

    public async Task<TrackingResponse?> GetByTokenAsync(string token, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(token) || token.Length is < 16 or > 64)
        {
            return null;
        }

        var appointment = await db.Appointments
            .AsNoTracking()
            .Include(a => a.Service)
            .FirstOrDefaultAsync(a => a.TrackingToken == token, ct);

        return appointment is null ? null : ToTrackingResponse(appointment);
    }

    public static TrackingResponse ToTrackingResponse(Appointment a)
    {
        var current = a.VehicleWorkStatus;
        var timeline = Steps.Select(step =>
        {
            var completedAt = step.Status switch
            {
                VehicleWorkStatus.VehicleReceived => a.VehicleReceivedAt,
                VehicleWorkStatus.InProgress => a.WorkStartedAt,
                VehicleWorkStatus.ReadyForPickup => a.ReadyAt,
                VehicleWorkStatus.Delivered => a.DeliveredAt,
                _ => null
            };

            var isCompleted = current > step.Status || (current == step.Status && completedAt.HasValue);
            var isCurrent = current == step.Status;

            return new TrackingTimelineStepDto(
                step.Status.ToString(),
                step.Label,
                completedAt,
                isCurrent,
                isCompleted
            );
        }).ToList();

        return new TrackingResponse(
            a.VehicleMake,
            a.VehicleModel,
            a.VehicleYear,
            a.LicensePlate,
            a.Service.Name,
            a.Date.ToString("yyyy-MM-dd"),
            a.TimeSlot,
            a.Status.ToString(),
            a.VehicleWorkStatus.ToString(),
            StatusLabel(a.VehicleWorkStatus),
            a.EstimatedCompletionAt,
            a.TrackingNote,
            timeline
        );
    }

    public static void ApplyWorkStatusTimestamps(Appointment appointment, VehicleWorkStatus newStatus, DateTime now)
    {
        if (newStatus >= VehicleWorkStatus.VehicleReceived && appointment.VehicleReceivedAt is null)
        {
            appointment.VehicleReceivedAt = now;
        }

        if (newStatus >= VehicleWorkStatus.InProgress && appointment.WorkStartedAt is null)
        {
            appointment.WorkStartedAt = now;
        }

        if (newStatus >= VehicleWorkStatus.ReadyForPickup && appointment.ReadyAt is null)
        {
            appointment.ReadyAt = now;
        }

        if (newStatus >= VehicleWorkStatus.Delivered && appointment.DeliveredAt is null)
        {
            appointment.DeliveredAt = now;
        }
    }
}
