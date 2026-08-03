namespace YunusAutoGarage.Api.Entities;

public class PromoBannerSettings
{
    public const int SingletonId = 1;

    public int Id { get; set; } = SingletonId;
    public bool IsEnabled { get; set; } = true;
    public string MessageText { get; set; } = string.Empty;
    public string? CtaText { get; set; }
    public string? CtaLink { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
