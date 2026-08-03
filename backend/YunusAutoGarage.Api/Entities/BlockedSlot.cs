namespace YunusAutoGarage.Api.Entities;

public class BlockedSlot
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public string? TimeSlot { get; set; }
    public string? Reason { get; set; }
}
