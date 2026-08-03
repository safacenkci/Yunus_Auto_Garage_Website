using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Dtos;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Services;

public class AdminService(
    AppDbContext db,
    ISmsService smsService,
    AnalyticsService analyticsService,
    IOptions<PublicSiteOptions> siteOptions)
{
    private readonly PublicSiteOptions _site = siteOptions.Value;

    public async Task<PagedResult<AppointmentResponse>> GetAppointmentsAsync(
        string? status,
        DateOnly? date,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var query = db.Appointments.Include(a => a.Service).AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<AppointmentStatus>(status, true, out var statusEnum))
        {
            query = query.Where(a => a.Status == statusEnum);
        }

        if (date.HasValue)
        {
            query = query.Where(a => a.Date == date.Value);
        }

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<AppointmentResponse>(
            items.Select(a => AppointmentService.ToResponse(a, a.Service.Name)).ToList(),
            total,
            page,
            pageSize
        );
    }

    public async Task<AppointmentResponse?> UpdateStatusAsync(Guid id, string status, CancellationToken ct = default)
    {
        if (!Enum.TryParse<AppointmentStatus>(status, true, out var newStatus))
        {
            throw new ArgumentException("Geçersiz durum.");
        }

        var appointment = await db.Appointments.Include(a => a.Service).FirstOrDefaultAsync(a => a.Id == id, ct);
        if (appointment is null)
        {
            return null;
        }

        if (string.IsNullOrWhiteSpace(appointment.TrackingToken))
        {
            appointment.TrackingToken = TrackingService.GenerateTrackingToken();
        }

        var oldStatus = appointment.Status;
        appointment.Status = newStatus;
        appointment.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        if (newStatus == AppointmentStatus.Confirmed && oldStatus != AppointmentStatus.Confirmed)
        {
            _ = smsService.SendCustomerConfirmationAsync(appointment, BuildTrackingUrl(appointment.TrackingToken), ct);
        }

        return AppointmentService.ToResponse(appointment, appointment.Service.Name);
    }

    public async Task<AppointmentResponse?> UpdateTrackingAsync(
        Guid id,
        UpdateVehicleTrackingRequest request,
        CancellationToken ct = default)
    {
        if (!Enum.TryParse<VehicleWorkStatus>(request.VehicleWorkStatus, true, out var newWorkStatus))
        {
            throw new ArgumentException("Geçersiz araç durumu.");
        }

        var appointment = await db.Appointments.Include(a => a.Service).FirstOrDefaultAsync(a => a.Id == id, ct);
        if (appointment is null)
        {
            return null;
        }

        if (appointment.Status is AppointmentStatus.Cancelled or AppointmentStatus.NoShow)
        {
            throw new ArgumentException("İptal veya gelmedi durumundaki randevularda takip güncellenemez.");
        }

        if (string.IsNullOrWhiteSpace(appointment.TrackingToken))
        {
            appointment.TrackingToken = TrackingService.GenerateTrackingToken();
        }

        var note = string.IsNullOrWhiteSpace(request.TrackingNote) ? null : request.TrackingNote.Trim();
        if (note is { Length: > 500 })
        {
            throw new ArgumentException("Takip notu en fazla 500 karakter olabilir.");
        }

        var now = DateTime.UtcNow;
        appointment.VehicleWorkStatus = newWorkStatus;
        appointment.EstimatedCompletionAt = request.EstimatedCompletionAt?.ToUniversalTime();
        appointment.TrackingNote = note;
        appointment.UpdatedAt = now;
        TrackingService.ApplyWorkStatusTimestamps(appointment, newWorkStatus, now);

        await db.SaveChangesAsync(ct);

        _ = smsService.SendTrackingUpdateAsync(appointment, BuildTrackingUrl(appointment.TrackingToken), ct);

        return AppointmentService.ToResponse(appointment, appointment.Service.Name);
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var todayCount = await db.Appointments.CountAsync(a => a.Date == today, ct);
        var pendingCount = await db.Appointments.CountAsync(a => a.Status == AppointmentStatus.Pending, ct);
        var totalCount = await db.Appointments.CountAsync(ct);
        var weeklyViews = await analyticsService.GetWeeklyViewsAsync(ct);

        var recent = await db.Appointments
            .Include(a => a.Service)
            .OrderByDescending(a => a.CreatedAt)
            .Take(5)
            .ToListAsync(ct);

        return new DashboardSummaryDto(
            todayCount,
            pendingCount,
            weeklyViews,
            totalCount,
            recent.Select(a => AppointmentService.ToResponse(a, a.Service.Name)).ToList()
        );
    }

    public async Task<IReadOnlyList<BlockedSlotDto>> GetBlockedSlotsAsync(CancellationToken ct = default)
    {
        return await db.BlockedSlots
            .OrderByDescending(b => b.Date)
            .Select(b => new BlockedSlotDto(b.Id, b.Date.ToString("yyyy-MM-dd"), b.TimeSlot, b.Reason))
            .ToListAsync(ct);
    }

    public async Task<BlockedSlotDto> CreateBlockedSlotAsync(CreateBlockedSlotRequest request, CancellationToken ct = default)
    {
        if (!DateOnly.TryParse(request.Date, out var date))
        {
            throw new ArgumentException("Geçersiz tarih.");
        }

        var slot = new BlockedSlot
        {
            Date = date,
            TimeSlot = string.IsNullOrWhiteSpace(request.TimeSlot) ? null : request.TimeSlot,
            Reason = request.Reason
        };

        db.BlockedSlots.Add(slot);
        await db.SaveChangesAsync(ct);

        return new BlockedSlotDto(slot.Id, slot.Date.ToString("yyyy-MM-dd"), slot.TimeSlot, slot.Reason);
    }

    public async Task<bool> DeleteBlockedSlotAsync(int id, CancellationToken ct = default)
    {
        var slot = await db.BlockedSlots.FindAsync([id], ct);
        if (slot is null)
        {
            return false;
        }

        db.BlockedSlots.Remove(slot);
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<PagedResult<SmsLogDto>> GetSmsLogsAsync(int page, int pageSize, CancellationToken ct = default)
    {
        var total = await db.SmsLogs.CountAsync(ct);
        var items = await db.SmsLogs
            .OrderByDescending(l => l.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new SmsLogDto(l.Id, l.Type.ToString(), l.RecipientCount, l.Message, l.ResultCode, l.Success, l.CreatedAt))
            .ToListAsync(ct);

        return new PagedResult<SmsLogDto>(items, total, page, pageSize);
    }

    public async Task<(bool Success, string ResultCode, int RecipientCount)> SendBulkSmsAsync(
        BulkSmsRequest request,
        CancellationToken ct = default)
    {
        var phones = await ResolveRecipientsAsync(request, ct);
        return await smsService.SendBulkAsync(phones, request.Message, ct);
    }

    private string BuildTrackingUrl(string token)
    {
        var baseUrl = (_site.Url ?? string.Empty).TrimEnd('/');
        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            baseUrl = "https://aksarayotoelektrik.com";
        }

        return $"{baseUrl}/takip/{token}";
    }

    private async Task<List<string>> ResolveRecipientsAsync(BulkSmsRequest request, CancellationToken ct)
    {
        return request.RecipientSource switch
        {
            "all" => await db.Appointments.Select(a => a.Phone).Distinct().ToListAsync(ct),
            "status" when Enum.TryParse<AppointmentStatus>(request.StatusFilter, true, out var status) =>
                await db.Appointments.Where(a => a.Status == status).Select(a => a.Phone).Distinct().ToListAsync(ct),
            "manual" => (request.ManualNumbers ?? string.Empty)
                .Split([',', ';', '\n'], StringSplitOptions.RemoveEmptyEntries)
                .Select(p => p.Trim())
                .Where(PhoneNormalizer.IsValid)
                .Select(PhoneNormalizer.Normalize)
                .Distinct()
                .ToList(),
            _ => []
        };
    }
}
