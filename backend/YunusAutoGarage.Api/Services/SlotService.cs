using Microsoft.Extensions.Options;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Dtos;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Services;

public class SlotService(AppDbContext db, IOptions<BookingOptions> bookingOptions)
{
    private static readonly TimeZoneInfo IstanbulTimeZone = GetIstanbulTimeZone();

    private static TimeZoneInfo GetIstanbulTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
        }
        catch (TimeZoneNotFoundException)
        {
            return TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");
        }
    }

    private readonly BookingOptions _booking = bookingOptions.Value;

    public async Task<IReadOnlyList<SlotDto>> GetSlotsForDateAsync(DateOnly date, CancellationToken ct = default)
    {
        var today = GetTodayInIstanbul();
        if (date < today || date > today.AddDays(_booking.MaxDaysAhead))
        {
            return [];
        }

        var blocked = await db.BlockedSlots
            .Where(b => b.Date == date)
            .ToListAsync(ct);

        if (blocked.Any(b => b.TimeSlot == null))
        {
            return [];
        }

        var blockedSlots = blocked
            .Where(b => b.TimeSlot != null)
            .Select(b => b.TimeSlot!)
            .ToHashSet();

        var open = TimeOnly.Parse(_booking.OpenTime);
        var close = TimeOnly.Parse(_booking.CloseTime);
        var nowIstanbul = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, IstanbulTimeZone);
        var nowTime = TimeOnly.FromDateTime(nowIstanbul);

        var slots = new List<SlotDto>();
        var current = open;

        while (current < close)
        {
            var timeStr = current.ToString("HH:mm");

            if (blockedSlots.Contains(timeStr))
            {
                current = current.AddMinutes(_booking.SlotMinutes);
                continue;
            }

            if (date == today && current <= nowTime)
            {
                current = current.AddMinutes(_booking.SlotMinutes);
                continue;
            }

            var bookedCount = await db.Appointments.CountAsync(
                a => a.Date == date
                     && a.TimeSlot == timeStr
                     && (a.Status == AppointmentStatus.Pending || a.Status == AppointmentStatus.Confirmed),
                ct);

            slots.Add(new SlotDto(timeStr, bookedCount < _booking.CapacityPerSlot));
            current = current.AddMinutes(_booking.SlotMinutes);
        }

        return slots;
    }

    public async Task<bool> IsSlotAvailableAsync(DateOnly date, string timeSlot, CancellationToken ct = default)
    {
        var slots = await GetSlotsForDateAsync(date, ct);
        return slots.Any(s => s.Time == timeSlot && s.Available);
    }

    private static DateOnly GetTodayInIstanbul()
    {
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, IstanbulTimeZone);
        return DateOnly.FromDateTime(now);
    }
}
