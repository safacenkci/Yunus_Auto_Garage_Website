namespace YunusAutoGarage.Api.Entities;

public class PageView
{
    public long Id { get; set; }
    public string Path { get; set; } = string.Empty;
    public string VisitorId { get; set; } = string.Empty;
    public string IpHash { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public string? Referrer { get; set; }
    public DateTime CreatedAt { get; set; }
}
