using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using YunusAutoGarage.Api.Dtos;
using YunusAutoGarage.Api.Entities;
using YunusAutoGarage.Api.Services;

namespace YunusAutoGarage.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(TokenService tokenService) : ControllerBase
{
    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await tokenService.LoginAsync(request.Username, request.Password, ct);
        if (result is null)
        {
            return Unauthorized(Problem(title: "Giriş başarısız", detail: "Kullanıcı adı veya şifre hatalı."));
        }

        return Ok(result);
    }
}

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminAppointmentsController(AdminService adminService) : ControllerBase
{
    [HttpGet("appointments")]
    public async Task<ActionResult<PagedResult<AppointmentResponse>>> GetAppointments(
        [FromQuery] string? status,
        [FromQuery] string? date,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        DateOnly? parsedDate = null;
        if (!string.IsNullOrWhiteSpace(date) && DateOnly.TryParse(date, out var d))
        {
            parsedDate = d;
        }

        var result = await adminService.GetAppointmentsAsync(status, parsedDate, page, pageSize, ct);
        return Ok(result);
    }

    [HttpPatch("appointments/{id:guid}/status")]
    public async Task<ActionResult<AppointmentResponse>> UpdateStatus(
        Guid id,
        [FromBody] UpdateStatusRequest request,
        CancellationToken ct)
    {
        try
        {
            var result = await adminService.UpdateStatusAsync(id, request.Status, ct);
            if (result is null)
            {
                return NotFound();
            }

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(Problem(title: "Validasyon hatası", detail: ex.Message));
        }
    }

    [HttpGet("dashboard/summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary(CancellationToken ct)
    {
        return Ok(await adminService.GetDashboardSummaryAsync(ct));
    }

    [HttpGet("analytics")]
    public async Task<ActionResult<AnalyticsResponseDto>> GetAnalytics(
        [FromQuery] string? from,
        [FromQuery] string? to,
        AnalyticsService analyticsService,
        CancellationToken ct = default)
    {
        var toDate = DateOnly.TryParse(to, out var t) ? t : DateOnly.FromDateTime(DateTime.UtcNow);
        var fromDate = DateOnly.TryParse(from, out var f) ? f : toDate.AddDays(-30);
        return Ok(await analyticsService.GetAnalyticsAsync(fromDate, toDate, ct));
    }

    [HttpPost("sms/bulk")]
    public async Task<IActionResult> SendBulkSms([FromBody] BulkSmsRequest request, CancellationToken ct)
    {
        var result = await adminService.SendBulkSmsAsync(request, ct);
        return Ok(new { result.Success, result.ResultCode, result.RecipientCount });
    }

    [HttpGet("sms/logs")]
    public async Task<ActionResult<PagedResult<SmsLogDto>>> GetSmsLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        return Ok(await adminService.GetSmsLogsAsync(page, pageSize, ct));
    }

    [HttpGet("blocked-slots")]
    public async Task<ActionResult<IReadOnlyList<BlockedSlotDto>>> GetBlockedSlots(CancellationToken ct)
    {
        return Ok(await adminService.GetBlockedSlotsAsync(ct));
    }

    [HttpPost("blocked-slots")]
    public async Task<ActionResult<BlockedSlotDto>> CreateBlockedSlot(
        [FromBody] CreateBlockedSlotRequest request,
        CancellationToken ct)
    {
        try
        {
            return Ok(await adminService.CreateBlockedSlotAsync(request, ct));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(Problem(title: "Validasyon hatası", detail: ex.Message));
        }
    }

    [HttpDelete("blocked-slots/{id:int}")]
    public async Task<IActionResult> DeleteBlockedSlot(int id, CancellationToken ct)
    {
        var deleted = await adminService.DeleteBlockedSlotAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }

    [HttpGet("gallery")]
    public async Task<ActionResult<IReadOnlyList<GalleryItemDto>>> GetGallery(
        GalleryService galleryService,
        CancellationToken ct)
    {
        return Ok(await galleryService.GetAllAsync(ct));
    }

    [HttpPost("gallery")]
    [RequestSizeLimit(52_428_800)]
    public async Task<ActionResult<GalleryItemDto>> CreateGalleryItem(
        [FromForm] string mediaType,
        [FromForm] string? title,
        [FromForm] int sortOrder,
        [FromForm] bool isActive,
        [FromForm] IFormFile? file,
        [FromForm] string? embedUrl,
        GalleryService galleryService,
        CancellationToken ct)
    {
        try
        {
            var parsedType = ParseMediaType(mediaType);
            var result = await galleryService.CreateAsync(parsedType, title, sortOrder, isActive, file, embedUrl, ct);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(Problem(title: "Validasyon hatası", detail: ex.Message));
        }
    }

    [HttpPut("gallery/{id:int}")]
    [RequestSizeLimit(52_428_800)]
    public async Task<ActionResult<GalleryItemDto>> UpdateGalleryItem(
        int id,
        [FromForm] string mediaType,
        [FromForm] string? title,
        [FromForm] int sortOrder,
        [FromForm] bool isActive,
        [FromForm] IFormFile? file,
        [FromForm] string? embedUrl,
        GalleryService galleryService,
        CancellationToken ct)
    {
        try
        {
            var parsedType = ParseMediaType(mediaType);
            var result = await galleryService.UpdateAsync(id, parsedType, title, sortOrder, isActive, file, embedUrl, ct);
            return result is null ? NotFound() : Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(Problem(title: "Validasyon hatası", detail: ex.Message));
        }
    }

    [HttpDelete("gallery/{id:int}")]
    public async Task<IActionResult> DeleteGalleryItem(int id, GalleryService galleryService, CancellationToken ct)
    {
        var deleted = await galleryService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }

    private static GalleryMediaType ParseMediaType(string value) =>
        Enum.TryParse<GalleryMediaType>(value, true, out var parsed)
            ? parsed
            : throw new ArgumentException("Geçersiz medya türü. Photo veya Video olmalıdır.");

    [HttpGet("promo-banner")]
    public async Task<ActionResult<PromoBannerAdminDto>> GetPromoBanner(
        PromoBannerService promoBannerService,
        CancellationToken ct)
    {
        return Ok(await promoBannerService.GetAdminAsync(ct));
    }

    [HttpPut("promo-banner")]
    public async Task<ActionResult<PromoBannerAdminDto>> UpdatePromoBanner(
        [FromBody] UpdatePromoBannerRequest request,
        PromoBannerService promoBannerService,
        CancellationToken ct)
    {
        try
        {
            return Ok(await promoBannerService.UpdateAsync(request, ct));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(Problem(title: "Validasyon hatası", detail: ex.Message));
        }
    }
}

[ApiController]
[Route("api/analytics")]
public class AnalyticsController(AnalyticsService analyticsService) : ControllerBase
{
    [HttpPost("track")]
    [EnableRateLimiting("analytics")]
    public async Task<IActionResult> Track([FromBody] TrackRequest request, CancellationToken ct)
    {
        try
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var ua = Request.Headers.UserAgent.ToString();
            await analyticsService.TrackAsync(request, ip, ua, ct);
        }
        catch
        {
            // Always return 204 per spec
        }

        return NoContent();
    }
}
