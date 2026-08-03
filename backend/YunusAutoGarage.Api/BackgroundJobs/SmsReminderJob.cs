using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Entities;
using YunusAutoGarage.Api.Services;

namespace YunusAutoGarage.Api.BackgroundJobs;

public class SmsReminderJob(IServiceScopeFactory scopeFactory, ILogger<SmsReminderJob> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await SendRemindersAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "SMS reminder job failed");
            }

            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }

    private async Task SendRemindersAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var smsService = scope.ServiceProvider.GetRequiredService<ISmsService>();

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var appointments = await db.Appointments
            .Where(a => a.Date == tomorrow && a.Status == AppointmentStatus.Confirmed)
            .ToListAsync(ct);

        foreach (var appointment in appointments)
        {
            var alreadySent = await db.SmsLogs.AnyAsync(
                l => l.Type == SmsType.Reminder
                     && l.Recipients.Contains(appointment.Phone)
                     && l.Message.Contains(appointment.TimeSlot),
                ct);

            if (!alreadySent)
            {
                await smsService.SendReminderAsync(appointment, ct);
            }
        }
    }
}
