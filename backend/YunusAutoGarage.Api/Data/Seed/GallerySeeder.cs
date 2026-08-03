using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Data.Seed;

public static class GallerySeeder
{
    private static readonly (string FileName, string? Title)[] SeedItems =
    [
        ("01-atolye-ic.png", "Atölye iç mekan"),
        ("02-dis-cephe-gunduz.png", "Dükkan dış cephe"),
        ("03-vw-golf.png", "Volkswagen Golf servis"),
        ("04-dis-cephe-bulutlu.png", "Dış cephe"),
        ("05-dis-cephe-coklu-arac.png", "Servis alanı"),
        ("06-bmw-f30.png", "BMW F30"),
        ("07-elektrik-tesisati.png", "Elektrik tesisatı"),
        ("08-motor-sokumu.png", "Motor sökümü"),
        ("09-dis-cephe-bmw.png", "BMW servis"),
        ("10-bmw-diagnostik.png", "Bilgisayarlı arıza tespiti"),
    ];

    public static async Task SeedAsync(AppDbContext db, IWebHostEnvironment env, IConfiguration configuration)
    {
        var storage = configuration.GetSection(StorageOptions.SectionName).Get<StorageOptions>() ?? new StorageOptions();
        var seedDir = Path.Combine(env.ContentRootPath, "Data", "Seed", "gallery");
        if (!Directory.Exists(seedDir))
        {
            return;
        }

        var uploadRoot = Path.IsPathRooted(storage.UploadPath)
            ? storage.UploadPath
            : Path.Combine(env.ContentRootPath, storage.UploadPath);
        Directory.CreateDirectory(uploadRoot);

        var requestPath = storage.RequestPath.TrimEnd('/');
        var existingSeedNames = await db.GalleryItems
            .Where(g => g.StoredFileName != null && g.StoredFileName.StartsWith("seed-"))
            .Select(g => g.StoredFileName!)
            .ToListAsync();

        var sortOrder = 1;
        foreach (var (fileName, title) in SeedItems)
        {
            var storedFileName = $"seed-{fileName}";
            if (existingSeedNames.Contains(storedFileName))
            {
                sortOrder++;
                continue;
            }

            var sourcePath = Path.Combine(seedDir, fileName);
            if (!File.Exists(sourcePath))
            {
                sortOrder++;
                continue;
            }

            var destPath = Path.Combine(uploadRoot, storedFileName);
            File.Copy(sourcePath, destPath, overwrite: true);

            db.GalleryItems.Add(new GalleryItem
            {
                Title = title,
                MediaType = GalleryMediaType.Photo,
                MediaUrl = $"{requestPath}/{storedFileName}",
                StoredFileName = storedFileName,
                IsActive = true,
                SortOrder = sortOrder,
                CreatedAt = DateTime.UtcNow
            });

            sortOrder++;
        }

        await db.SaveChangesAsync();
    }
}
