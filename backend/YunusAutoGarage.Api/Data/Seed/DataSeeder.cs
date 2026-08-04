using Microsoft.EntityFrameworkCore;
using YunusAutoGarage.Api.Data;
using YunusAutoGarage.Api.Services;

namespace YunusAutoGarage.Api.Data.Seed;

public static class DataSeeder
{
    private static readonly string[] RetiredServiceNames =
    [
        "Motor Revizyonu",
        "Periyodik Bakım",
        "Alt Takım & Fren",
        "Oto Boya"
    ];

    public static async Task SeedAsync(AppDbContext db, IConfiguration configuration, IWebHostEnvironment env)
    {
        await SyncServicesAsync(db);
        await SeedPromoBannerAsync(db);
        await GallerySeeder.SeedAsync(db, env, configuration);

        if (!await db.AdminUsers.AnyAsync())
        {
            var username = configuration["AdminSeed:Username"] ?? "admin";
            var password = configuration["AdminSeed:Password"] ?? "ChangeMe123!";

            db.AdminUsers.Add(new Entities.AdminUser
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                CreatedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();
        }
    }

    private static async Task SyncServicesAsync(AppDbContext db)
    {
        var existing = await db.Services.ToListAsync();

        foreach (var retired in RetiredServiceNames)
        {
            var service = existing.FirstOrDefault(s => s.Name == retired);
            if (service is not null)
            {
                service.IsActive = false;
            }
        }

        foreach (var serviceDefinition in ServiceCatalog.Definitions)
        {
            var service = existing.FirstOrDefault(s => s.Name == serviceDefinition.Name);
            if (service is null)
            {
                db.Services.Add(new Entities.Service
                {
                    Name = serviceDefinition.Name,
                    Icon = serviceDefinition.Icon,
                    Description = serviceDefinition.Description,
                    IsActive = true,
                    SortOrder = serviceDefinition.SortOrder
                });
            }
            else
            {
                service.Icon = serviceDefinition.Icon;
                service.Description = serviceDefinition.Description;
                service.IsActive = true;
                service.SortOrder = serviceDefinition.SortOrder;
            }
        }

        await db.SaveChangesAsync();
    }

    private static async Task SeedPromoBannerAsync(AppDbContext db)
    {
        if (await db.PromoBannerSettings.AnyAsync())
        {
            return;
        }

        db.PromoBannerSettings.Add(new Entities.PromoBannerSettings
        {
            Id = Entities.PromoBannerSettings.SingletonId,
            IsEnabled = true,
            MessageText = Services.PromoBannerService.DefaultMessageText,
            CtaText = Services.PromoBannerService.DefaultCtaText,
            CtaLink = Services.PromoBannerService.DefaultCtaLink,
            UpdatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
    }
}
