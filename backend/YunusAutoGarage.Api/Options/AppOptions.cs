namespace YunusAutoGarage.Api;

public class BookingOptions
{
    public const string SectionName = "Booking";

    public string OpenTime { get; set; } = "08:30";
    public string CloseTime { get; set; } = "18:30";
    public int SlotMinutes { get; set; } = 60;
    public int CapacityPerSlot { get; set; } = 1;
    public int MaxDaysAhead { get; set; } = 14;
}

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Secret { get; set; } = string.Empty;
    public int ExpirationHours { get; set; } = 12;
}

public class AdminSeedOptions
{
    public const string SectionName = "AdminSeed";

    public string Username { get; set; } = "admin";
    public string Password { get; set; } = "ChangeMe123!";
}

public class NetgsmOptions
{
    public const string SectionName = "Netgsm";

    public string UserCode { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string MsgHeader { get; set; } = string.Empty;
    public bool Enabled { get; set; }
    public string AdminPhone { get; set; } = string.Empty;
}

public class StorageOptions
{
    public const string SectionName = "Storage";

    public string UploadPath { get; set; } = "uploads/gallery";
    public string RequestPath { get; set; } = "/uploads/gallery";
    public int MaxFileSizeMb { get; set; } = 50;
    public string[] AllowedImageExtensions { get; set; } = [".jpg", ".jpeg", ".png", ".webp"];
    public string[] AllowedVideoExtensions { get; set; } = [".mp4", ".webm"];
}

public class PublicSiteOptions
{
    public const string SectionName = "Site";

    public string Url { get; set; } = "https://aksarayotoelektrik.com";
}
