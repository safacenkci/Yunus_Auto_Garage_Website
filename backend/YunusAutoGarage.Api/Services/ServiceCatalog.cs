namespace YunusAutoGarage.Api.Services;

public static class ServiceCatalog
{
    public const string ElectronicsCode = "electronics";
    public const string ClimateCode = "climate";
    public const string TuningCode = "tuning";
    public const string OtherCode = "other";

    public static readonly IReadOnlyList<ServiceDefinition> Definitions =
    [
        new(
            ElectronicsCode,
            "Elektronik Arıza",
            "electric_car",
            "Bilgisayarlı arıza tespiti, ECU, sensör ve elektrik sistemlerinde uzman çözüm. Modern diagnostik cihazlarla hızlı teşhis.",
            "options",
            [
                "Bilgisayarlı arıza tespiti",
                "ECU / Beyin",
                "Sensör arızası",
                "Marş / Şarj sistemi",
                "Far / Aydınlatma",
                "Diğer elektrik arızası"
            ],
            1
        ),
        new(
            ClimateCode,
            "Klima Dolumu",
            "ac_unit",
            "Klima gazı dolumu, kaçak kontrolü ve soğutma performansı optimizasyonu. Yaz-kış konforunuz bizim işimiz.",
            "options",
            [
                "Klima gazı dolumu",
                "Kaçak kontrolü",
                "Klima bakım / temizlik",
                "Polen filtresi",
                "Soğutma performans kontrolü"
            ],
            2
        ),
        new(
            TuningCode,
            "Oto Tuning",
            "format_paint",
            "Kaporta, boya, far parlatma, pasta cila ve oto aksesuar işlemleri. Aracınıza estetik ve performans kazandırıyoruz.",
            "options",
            ["Oto Kaporta", "Far Parlatma", "Boya", "Pasta Cila", "Oto Aksesuar"],
            3
        ),
        new(
            OtherCode,
            "Diğer",
            "more_horiz",
            "Listede olmayan bir işlem için talebinizi yazın. Ekibimiz ihtiyacınıza göre size dönüş yapacaktır.",
            "note",
            [],
            4
        )
    ];

    public static ServiceDefinition GetDefinition(string serviceName)
    {
        return Definitions.FirstOrDefault(def => def.Name == serviceName)
            ?? new ServiceDefinition(
                ToCode(serviceName),
                serviceName,
                "build",
                string.Empty,
                "options",
                [],
                999
            );
    }

    public static bool RequiresNote(string serviceName) => GetDefinition(serviceName).BookingMode == "note";

    private static string ToCode(string serviceName)
    {
        return string.Concat(serviceName
                .Trim()
                .ToLowerInvariant()
                .Normalize(System.Text.NormalizationForm.FormD)
                .Where(c => System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c) != System.Globalization.UnicodeCategory.NonSpacingMark)
                .Select(c => char.IsLetterOrDigit(c) ? c : '-'))
            .Trim('-');
    }
}

public record ServiceDefinition(
    string Code,
    string Name,
    string Icon,
    string Description,
    string BookingMode,
    IReadOnlyList<string> Options,
    int SortOrder
);
