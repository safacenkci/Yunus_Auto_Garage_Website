using Microsoft.EntityFrameworkCore;
using YunusAutoGarage.Api.Data;

namespace YunusAutoGarage.Api.Data.Seed;

public static class DataSeeder
{
    private static readonly (string Name, string Icon, string Description, int SortOrder)[] ActiveServices =
    [
        (
            "Elektronik Arıza",
            "electric_car",
            "Bilgisayarlı arıza tespiti, ECU, sensör ve elektrik sistemlerinde uzman çözüm. Modern diagnostik cihazlarla hızlı teşhis.",
            1
        ),
        (
            "Klima Dolumu",
            "ac_unit",
            "Klima gazı dolumu, kaçak kontrolü ve soğutma performansı optimizasyonu. Yaz-kış konforunuz bizim işimiz.",
            2
        ),
        (
            "Oto Tuning",
            "format_paint",
            "Kaporta, boya, far parlatma, pasta cila ve oto aksesuar işlemleri. Aracınıza estetik ve performans kazandırıyoruz.",
            3
        ),
        (
            "Diğer",
            "more_horiz",
            "Listede olmayan bir işlem için talebinizi yazın. Ekibimiz ihtiyacınıza göre size dönüş yapacaktır.",
            4
        )
    ];

    private static readonly string[] RetiredServiceNames =
    [
        "Motor Revizyonu",
        "Periyodik Bakım",
        "Alt Takım & Fren",
        "Oto Boya"
    ];

    public static async Task SeedAsync(AppDbContext db, IConfiguration configuration)
    {
        await SyncServicesAsync(db);
        await SeedPromoBannerAsync(db);

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

        foreach (var (name, icon, description, sortOrder) in ActiveServices)
        {
            var service = existing.FirstOrDefault(s => s.Name == name);
            if (service is null)
            {
                db.Services.Add(new Entities.Service
                {
                    Name = name,
                    Icon = icon,
                    Description = description,
                    IsActive = true,
                    SortOrder = sortOrder
                });
            }
            else
            {
                service.Icon = icon;
                service.Description = description;
                service.IsActive = true;
                service.SortOrder = sortOrder;
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
