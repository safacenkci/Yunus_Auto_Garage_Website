using Microsoft.EntityFrameworkCore;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Dtos;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Services;

public class PromoBannerService(AppDbContext db)
{
    public const string DefaultMessageText = "İlk randevunuzda %20 indirim fırsatı —";
    public const string DefaultCtaText = "Hemen randevu alın";
    public const string DefaultCtaLink = "/randevu";

    public async Task<PromoBannerDto?> GetActiveAsync(CancellationToken ct)
    {
        var settings = await GetOrCreateAsync(ct);
        if (!settings.IsEnabled || string.IsNullOrWhiteSpace(settings.MessageText))
        {
            return null;
        }

        return ToPublicDto(settings);
    }

    public async Task<PromoBannerAdminDto> GetAdminAsync(CancellationToken ct)
    {
        var settings = await GetOrCreateAsync(ct);
        return ToAdminDto(settings);
    }

    public async Task<PromoBannerAdminDto> UpdateAsync(UpdatePromoBannerRequest request, CancellationToken ct)
    {
        var messageText = request.MessageText?.Trim() ?? string.Empty;
        if (messageText.Length > 500)
        {
            throw new ArgumentException("Banner metni en fazla 500 karakter olabilir.");
        }

        var ctaText = NormalizeOptional(request.CtaText, 100);
        if (ctaText is null)
        {
            throw new ArgumentException("Buton metni zorunludur.");
        }

        var ctaLink = NormalizeCtaLink(request.CtaLink) ?? DefaultCtaLink;

        var settings = await GetOrCreateAsync(ct);
        settings.IsEnabled = request.IsEnabled;
        settings.MessageText = messageText;
        settings.CtaText = ctaText;
        settings.CtaLink = ctaLink;
        settings.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return ToAdminDto(settings);
    }

    public async Task EnsureSeededAsync(CancellationToken ct = default)
    {
        var exists = await db.PromoBannerSettings.AnyAsync(p => p.Id == PromoBannerSettings.SingletonId, ct);
        if (exists)
        {
            return;
        }

        db.PromoBannerSettings.Add(new PromoBannerSettings
        {
            Id = PromoBannerSettings.SingletonId,
            IsEnabled = true,
            MessageText = DefaultMessageText,
            CtaText = DefaultCtaText,
            CtaLink = DefaultCtaLink,
            UpdatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync(ct);
    }

    private async Task<PromoBannerSettings> GetOrCreateAsync(CancellationToken ct)
    {
        var settings = await db.PromoBannerSettings
            .FirstOrDefaultAsync(p => p.Id == PromoBannerSettings.SingletonId, ct);

        if (settings is not null)
        {
            return settings;
        }

        settings = new PromoBannerSettings
        {
            Id = PromoBannerSettings.SingletonId,
            IsEnabled = true,
            MessageText = DefaultMessageText,
            CtaText = DefaultCtaText,
            CtaLink = DefaultCtaLink,
            UpdatedAt = DateTime.UtcNow
        };

        db.PromoBannerSettings.Add(settings);
        await db.SaveChangesAsync(ct);
        return settings;
    }

    private static string? NormalizeOptional(string? value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();
        return trimmed.Length > maxLength ? trimmed[..maxLength] : trimmed;
    }

    private static string? NormalizeCtaLink(string? value)
    {
        var trimmed = NormalizeOptional(value, 500);
        if (trimmed is null)
        {
            return null;
        }

        // Site içi yol: /randevu, /#hizmetler
        if (trimmed.StartsWith('/'))
        {
            return trimmed;
        }

        // Protokolü olmayan alan adları: example.com, www.example.com
        if (!trimmed.Contains("://", StringComparison.Ordinal)
            && !trimmed.Contains(':', StringComparison.Ordinal)
            && trimmed.Contains('.', StringComparison.Ordinal))
        {
            trimmed = "https://" + trimmed;
        }

        if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var uri))
        {
            throw new ArgumentException(
                "CTA bağlantısı site içi yol (/randevu), tam URL (https://…) veya tel:/mailto: gibi geçerli bir link olmalıdır.");
        }

        // javascript: gibi tehlikeli şemaları engelle
        var scheme = uri.Scheme.ToLowerInvariant();
        if (scheme is "javascript" or "data" or "vbscript")
        {
            throw new ArgumentException("Bu bağlantı türüne izin verilmiyor.");
        }

        return trimmed;
    }

    private static PromoBannerDto ToPublicDto(PromoBannerSettings settings) =>
        new(settings.MessageText, settings.CtaText, settings.CtaLink);

    private static PromoBannerAdminDto ToAdminDto(PromoBannerSettings settings) =>
        new(settings.IsEnabled, settings.MessageText, settings.CtaText, settings.CtaLink, settings.UpdatedAt);
}
