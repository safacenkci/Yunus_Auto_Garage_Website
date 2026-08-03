using Microsoft.EntityFrameworkCore;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Dtos;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Services;

public class GalleryService(AppDbContext db, FileStorageService fileStorage)
{
    public async Task<IReadOnlyList<GalleryItemDto>> GetActiveAsync(CancellationToken ct)
    {
        var items = await db.GalleryItems
            .AsNoTracking()
            .Where(g => g.IsActive)
            .OrderBy(g => g.SortOrder)
            .ThenByDescending(g => g.CreatedAt)
            .ToListAsync(ct);

        return items.Select(ToDto).ToList();
    }

    public async Task<IReadOnlyList<GalleryItemDto>> GetAllAsync(CancellationToken ct)
    {
        var items = await db.GalleryItems
            .AsNoTracking()
            .OrderBy(g => g.SortOrder)
            .ThenByDescending(g => g.CreatedAt)
            .ToListAsync(ct);

        return items.Select(ToDto).ToList();
    }

    public async Task<GalleryItemDto> CreateAsync(
        GalleryMediaType mediaType,
        string? title,
        int sortOrder,
        bool isActive,
        IFormFile? file,
        string? embedUrl,
        CancellationToken ct)
    {
        var (mediaUrl, storedFileName) = await ResolveMediaAsync(mediaType, file, embedUrl, null, ct);

        var item = new GalleryItem
        {
            Title = NormalizeTitle(title),
            MediaType = mediaType,
            MediaUrl = mediaUrl,
            StoredFileName = storedFileName,
            SortOrder = sortOrder,
            IsActive = isActive,
            CreatedAt = DateTime.UtcNow
        };

        db.GalleryItems.Add(item);
        await db.SaveChangesAsync(ct);

        return ToDto(item);
    }

    public async Task<GalleryItemDto?> UpdateAsync(
        int id,
        GalleryMediaType mediaType,
        string? title,
        int sortOrder,
        bool isActive,
        IFormFile? file,
        string? embedUrl,
        CancellationToken ct)
    {
        var item = await db.GalleryItems.FindAsync([id], ct);
        if (item is null)
        {
            return null;
        }

        var previousStoredFile = item.StoredFileName;

        if (file is not null || !string.IsNullOrWhiteSpace(embedUrl))
        {
            var (mediaUrl, storedFileName) = await ResolveMediaAsync(mediaType, file, embedUrl, item, ct);
            item.MediaUrl = mediaUrl;
            item.StoredFileName = storedFileName;

            if (!string.Equals(previousStoredFile, storedFileName, StringComparison.Ordinal))
            {
                fileStorage.DeleteIfExists(previousStoredFile);
            }
        }
        else if (mediaType == GalleryMediaType.Video && string.IsNullOrWhiteSpace(embedUrl) && file is null && item.StoredFileName is null)
        {
            throw new ArgumentException("Video için dosya veya embed URL gerekli.");
        }

        item.Title = NormalizeTitle(title);
        item.MediaType = mediaType;
        item.SortOrder = sortOrder;
        item.IsActive = isActive;

        await db.SaveChangesAsync(ct);
        return ToDto(item);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct)
    {
        var item = await db.GalleryItems.FindAsync([id], ct);
        if (item is null)
        {
            return false;
        }

        fileStorage.DeleteIfExists(item.StoredFileName);
        db.GalleryItems.Remove(item);
        await db.SaveChangesAsync(ct);
        return true;
    }

    private async Task<(string MediaUrl, string? StoredFileName)> ResolveMediaAsync(
        GalleryMediaType mediaType,
        IFormFile? file,
        string? embedUrl,
        GalleryItem? existing,
        CancellationToken ct)
    {
        if (file is not null)
        {
            var saved = await fileStorage.SaveGalleryFileAsync(file, mediaType, ct);
            return (saved.MediaUrl, saved.StoredFileName);
        }

        if (mediaType == GalleryMediaType.Video && !string.IsNullOrWhiteSpace(embedUrl))
        {
            return (NormalizeEmbedUrl(embedUrl), null);
        }

        if (existing is not null)
        {
            return (existing.MediaUrl, existing.StoredFileName);
        }

        throw new ArgumentException(mediaType == GalleryMediaType.Video
            ? "Video için dosya yükleyin veya embed URL girin."
            : "Fotoğraf için dosya yükleyin.");
    }

    private static string? NormalizeTitle(string? title) =>
        string.IsNullOrWhiteSpace(title) ? null : title.Trim();

    private static string NormalizeEmbedUrl(string url)
    {
        var trimmed = url.Trim();
        if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var uri))
        {
            throw new ArgumentException("Geçersiz video URL'si.");
        }

        if (uri.Host.Contains("youtube.com", StringComparison.OrdinalIgnoreCase) ||
            uri.Host.Contains("youtu.be", StringComparison.OrdinalIgnoreCase) ||
            uri.Host.Contains("vimeo.com", StringComparison.OrdinalIgnoreCase))
        {
            return trimmed;
        }

        throw new ArgumentException("Video URL'si YouTube veya Vimeo olmalıdır.");
    }

    public static GalleryItemDto ToDto(GalleryItem item) =>
        new(
            item.Id,
            item.Title,
            item.MediaType.ToString(),
            item.MediaUrl,
            item.IsActive,
            item.SortOrder,
            item.CreatedAt);
}
