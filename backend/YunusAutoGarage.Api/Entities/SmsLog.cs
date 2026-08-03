namespace YunusAutoGarage.Api.Entities;

public class SmsLog
{
    public long Id { get; set; }
    public string Recipients { get; set; } = string.Empty;
    public int RecipientCount { get; set; }
    public string Message { get; set; } = string.Empty;
    public SmsType Type { get; set; }
    public string? NetgsmJobId { get; set; }
    public string ResultCode { get; set; } = string.Empty;
    public bool Success { get; set; }
    public DateTime CreatedAt { get; set; }
}
