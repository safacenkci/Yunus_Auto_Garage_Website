using Microsoft.Extensions.Options;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Services;

public class FileStorageService(IOptions<StorageOptions> options, IWebHostEnvironment env)
{
    private readonly StorageOptions _options = options.Value;

    public string UploadRootPath =>
        Path.IsPathRooted(_options.UploadPath)
            ? _options.UploadPath
            : Path.Combine(env.ContentRootPath, _options.UploadPath);

    public string RequestPath => _options.RequestPath.TrimEnd('/');

    public async Task<(string StoredFileName, string MediaUrl)> SaveGalleryFileAsync(
        IFormFile file,
        GalleryMediaType mediaType,
        CancellationToken ct)
    {
        ValidateFile(file, mediaType);

        Directory.CreateDirectory(UploadRootPath);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var storedFileName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(UploadRootPath, storedFileName);

        await using var stream = new FileStream(fullPath, FileMode.CreateNew);
        await file.CopyToAsync(stream, ct);

        var mediaUrl = $"{RequestPath}/{storedFileName}";
        return (storedFileName, mediaUrl);
    }

    public void DeleteIfExists(string? storedFileName)
    {
        if (string.IsNullOrWhiteSpace(storedFileName))
        {
            return;
        }

        var fullPath = Path.Combine(UploadRootPath, storedFileName);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }

    private void ValidateFile(IFormFile file, GalleryMediaType mediaType)
    {
        if (file.Length == 0)
        {
            throw new ArgumentException("Dosya boş olamaz.");
        }

        var maxBytes = _options.MaxFileSizeMb * 1024L * 1024L;
        if (file.Length > maxBytes)
        {
            throw new ArgumentException($"Dosya boyutu en fazla {_options.MaxFileSizeMb} MB olabilir.");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowed = mediaType == GalleryMediaType.Photo
            ? _options.AllowedImageExtensions
            : _options.AllowedVideoExtensions;

        if (!allowed.Contains(extension, StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Desteklenmeyen dosya türü.");
        }
    }
}
