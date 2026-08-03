using Microsoft.Extensions.Options;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Dtos;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Services;

public class AppointmentService(
    AppDbContext db,
    SlotService slotService,
    ISmsService smsService,
    IOptions<BookingOptions> bookingOptions)
{
    private readonly BookingOptions _booking = bookingOptions.Value;

    public async Task<IReadOnlyList<ServiceDto>> GetActiveServicesAsync(CancellationToken ct = default)
    {
        return await db.Services
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder)
            .Select(s => new ServiceDto(s.Id, s.Name, s.Icon, s.Description))
            .ToListAsync(ct);
    }

    public async Task<AppointmentResponse?> CreateAsync(CreateAppointmentRequest request, CancellationToken ct = default)
    {
        if (!request.KvkkConsent)
        {
            throw new ArgumentException("KVKK onayı zorunludur.");
        }

        if (request.FullName.Length is < 3 or > 100)
        {
            throw new ArgumentException("Ad soyad 3-100 karakter olmalıdır.");
        }

        if (!PhoneNormalizer.IsValid(request.Phone))
        {
            throw new ArgumentException("Geçerli bir telefon numarası giriniz.");
        }

        if (!DateOnly.TryParse(request.Date, out var date))
        {
            throw new ArgumentException("Geçersiz tarih formatı.");
        }

        var today = GetTodayInIstanbul();
        if (date < today || date > today.AddDays(_booking.MaxDaysAhead))
        {
            throw new ArgumentException("Tarih izin verilen aralık dışında.");
        }

        var service = await db.Services.FirstOrDefaultAsync(s => s.Id == request.ServiceId && s.IsActive, ct);
        if (service is null)
        {
            throw new ArgumentException("Geçersiz hizmet.");
        }

        string? note;
        if (service.Name == "Diğer")
        {
            note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();
            if (note is null || note.Length < 10)
            {
                throw new ArgumentException("Diğer hizmet seçildiğinde en az 10 karakterlik açıklama zorunludur.");
            }

            note = $"Diğer talep: {note}";
        }
        else
        {
            var options = request.SelectedOptions?
                .Where(o => !string.IsNullOrWhiteSpace(o))
                .Select(o => o.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (options is null || options.Count == 0)
            {
                throw new ArgumentException("En az bir işlem seçmelisiniz.");
            }

            note = $"Seçilen işlemler: {string.Join(", ", options)}";
        }

        await using var transaction = await db.Database.BeginTransactionAsync(ct);

        if (!await slotService.IsSlotAvailableAsync(date, request.TimeSlot, ct))
        {
            await transaction.RollbackAsync(ct);
            return null;
        }

        var currentYear = DateTime.UtcNow.Year + 1;
        if (request.VehicleYear < 1950 || request.VehicleYear > currentYear)
        {
            throw new ArgumentException($"Araç yılı 1950 ile {currentYear} arasında olmalıdır.");
        }

        var now = DateTime.UtcNow;
        var appointment = new Appointment
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Phone = PhoneNormalizer.Normalize(request.Phone),
            VehicleMake = request.VehicleMake.Trim(),
            VehicleModel = request.VehicleModel.Trim(),
            VehicleYear = request.VehicleYear,
            LicensePlate = null,
            ServiceId = request.ServiceId,
            Date = date,
            TimeSlot = request.TimeSlot,
            Note = note,
            Status = AppointmentStatus.Pending,
            KvkkConsent = true,
            CreatedAt = now,
            UpdatedAt = now,
            TrackingToken = TrackingService.GenerateTrackingToken(),
            VehicleWorkStatus = VehicleWorkStatus.None
        };

        db.Appointments.Add(appointment);

        try
        {
            await db.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync(ct);
            return null;
        }

        _ = smsService.SendAdminNewAppointmentNotificationAsync(appointment, service.Name, ct);

        return ToResponse(appointment, service.Name);
    }

    public static AppointmentResponse ToResponse(Appointment a, string serviceName) =>
        new(
            a.Id,
            a.FullName,
            a.Phone,
            a.VehicleMake,
            a.VehicleModel,
            a.VehicleYear,
            a.LicensePlate,
            a.ServiceId,
            serviceName,
            a.Date.ToString("yyyy-MM-dd"),
            a.TimeSlot,
            a.Note,
            a.Status.ToString(),
            a.CreatedAt,
            a.TrackingToken,
            a.VehicleWorkStatus.ToString(),
            a.EstimatedCompletionAt,
            a.TrackingNote
        );

    private static DateOnly GetTodayInIstanbul()
    {
        TimeZoneInfo tz;
        try
        {
            tz = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
        }
        catch (TimeZoneNotFoundException)
        {
            tz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");
        }

        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
        return DateOnly.FromDateTime(now);
    }
}
