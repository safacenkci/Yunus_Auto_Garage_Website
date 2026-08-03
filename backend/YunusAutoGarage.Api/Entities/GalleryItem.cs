namespace YunusAutoGarage.Api.Entities;

public class GalleryItem
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public GalleryMediaType MediaType { get; set; }
    public string MediaUrl { get; set; } = string.Empty;
    public string? StoredFileName { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
}
