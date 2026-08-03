namespace YunusAutoGarage.Api.Entities;

public class Appointment
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public string? LicensePlate { get; set; }
    public int ServiceId { get; set; }
    public Service Service { get; set; } = null!;
    public DateOnly Date { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public string? Note { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public bool KvkkConsent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
