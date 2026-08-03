using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using YunusAutoGarage.Api.Dtos;
using YunusAutoGarage.Api.Services;

namespace YunusAutoGarage.Api.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController(AppointmentService appointmentService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ServiceDto>>> Get(CancellationToken ct)
    {
        var services = await appointmentService.GetActiveServicesAsync(ct);
        return Ok(services);
    }
}

[ApiController]
[Route("api/gallery")]
public class GalleryController(GalleryService galleryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<GalleryItemDto>>> Get(CancellationToken ct)
    {
        return Ok(await galleryService.GetActiveAsync(ct));
    }
}

[ApiController]
[Route("api/promo-banner")]
public class PromoBannerController(PromoBannerService promoBannerService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PromoBannerDto?>> Get(CancellationToken ct)
    {
        var banner = await promoBannerService.GetActiveAsync(ct);
        return Ok(banner);
    }
}

[ApiController]
[Route("api/vehicles")]
public class VehiclesController(VehicleLookupService vehicleLookupService) : ControllerBase
{
    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<VehicleCategoryDto>>> GetCategories(CancellationToken ct) =>
        Ok(await vehicleLookupService.GetCategoriesAsync(ct));

    [HttpGet("makes")]
    public async Task<ActionResult<IReadOnlyList<VehicleMakeDto>>> GetMakes(
        [FromQuery] string category = "otomobil",
        CancellationToken ct = default) =>
        Ok(await vehicleLookupService.GetMakesAsync(category, ct));

    [HttpGet("models")]
    public async Task<ActionResult<IReadOnlyList<VehicleModelDto>>> GetModels([FromQuery] int makeId, CancellationToken ct)
    {
        if (makeId <= 0)
        {
            return BadRequest(Problem(title: "Geçersiz marka", detail: "makeId parametresi zorunludur."));
        }

        return Ok(await vehicleLookupService.GetModelsForMakeAsync(makeId, ct));
    }
}

[ApiController]
[Route("api/tracking")]
public class TrackingController(TrackingService trackingService) : ControllerBase
{
    [HttpGet("{token}")]
    [EnableRateLimiting("tracking")]
    public async Task<ActionResult<TrackingResponse>> Get(string token, CancellationToken ct)
    {
        var result = await trackingService.GetByTokenAsync(token, ct);
        if (result is null)
        {
            return NotFound(Problem(title: "Takip bulunamadı", detail: "Takip linki geçersiz veya süresi dolmuş olabilir."));
        }

        return Ok(result);
    }
}

[ApiController]
[Route("api/appointments")]
public class AppointmentsController(AppointmentService appointmentService, SlotService slotService) : ControllerBase
{
    [HttpGet("slots")]
    public async Task<ActionResult<IReadOnlyList<SlotDto>>> GetSlots([FromQuery] string date, CancellationToken ct)
    {
        if (!DateOnly.TryParse(date, CultureInfo.InvariantCulture, out var parsedDate))
        {
            return BadRequest(Problem(title: "Geçersiz tarih", detail: "date parametresi yyyy-MM-dd formatında olmalıdır."));
        }

        var slots = await slotService.GetSlotsForDateAsync(parsedDate, ct);
        return Ok(slots);
    }

    [HttpPost]
    [EnableRateLimiting("appointments")]
    public async Task<ActionResult<AppointmentResponse>> Create([FromBody] CreateAppointmentRequest request, CancellationToken ct)
    {
        try
        {
            var result = await appointmentService.CreateAsync(request, ct);
            if (result is null)
            {
                return Conflict(Problem(title: "Slot dolu", detail: "Seçilen saat dolu veya müsait değil."));
            }

            return CreatedAtAction(nameof(Create), result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(Problem(title: "Validasyon hatası", detail: ex.Message));
        }
    }
}
