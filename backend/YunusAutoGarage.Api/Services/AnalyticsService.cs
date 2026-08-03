using System.Security.Cryptography;
using System.Text;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Dtos;

namespace YunusAutoGarage.Api.Services;

public class AnalyticsService(AppDbContext db)
{
    private static readonly string[] BotPatterns = ["bot", "crawler", "spider", "slurp", "curl", "wget"];

    public async Task TrackAsync(TrackRequest request, string? ipAddress, string? userAgent, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Path) || string.IsNullOrWhiteSpace(request.VisitorId))
        {
            return;
        }

        if (request.Path.StartsWith("/admin", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        var ua = userAgent ?? string.Empty;
        if (BotPatterns.Any(b => ua.Contains(b, StringComparison.OrdinalIgnoreCase)))
        {
            return;
        }

        var ipHash = HashIp(ipAddress ?? "unknown");

        db.PageViews.Add(new Entities.PageView
        {
            Path = request.Path.Length > 500 ? request.Path[..500] : request.Path,
            VisitorId = request.VisitorId.Length > 50 ? request.VisitorId[..50] : request.VisitorId,
            IpHash = ipHash,
            UserAgent = ua.Length > 500 ? ua[..500] : ua,
            Referrer = request.Referrer?.Length > 500 ? request.Referrer[..500] : request.Referrer,
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync(ct);
    }

    public async Task<AnalyticsResponseDto> GetAnalyticsAsync(DateOnly from, DateOnly to, CancellationToken ct = default)
    {
        var fromDt = from.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var toDt = to.ToDateTime(new TimeOnly(23, 59, 59), DateTimeKind.Utc);

        var views = await db.PageViews
            .Where(v => v.CreatedAt >= fromDt && v.CreatedAt <= toDt)
            .ToListAsync(ct);

        var dailySeries = views
            .GroupBy(v => DateOnly.FromDateTime(v.CreatedAt))
            .OrderBy(g => g.Key)
            .Select(g => new AnalyticsDayDto(
                g.Key.ToString("yyyy-MM-dd"),
                g.Count(),
                g.Select(v => v.VisitorId).Distinct().Count()))
            .ToList();

        var topPages = views
            .GroupBy(v => v.Path)
            .OrderByDescending(g => g.Count())
            .Take(10)
            .Select(g => new TopPageDto(g.Key, g.Count()))
            .ToList();

        var totalAppointments = await db.Appointments.CountAsync(ct);

        return new AnalyticsResponseDto(dailySeries, topPages, totalAppointments);
    }

    public async Task<int> GetWeeklyViewsAsync(CancellationToken ct = default)
    {
        var weekAgo = DateTime.UtcNow.AddDays(-7);
        return await db.PageViews.CountAsync(v => v.CreatedAt >= weekAgo, ct);
    }

    private static string HashIp(string ip)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(ip));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
