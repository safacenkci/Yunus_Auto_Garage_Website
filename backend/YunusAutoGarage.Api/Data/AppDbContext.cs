using Microsoft.EntityFrameworkCore;
using YunusAutoGarage.Api.Entities;

namespace YunusAutoGarage.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<PageView> PageViews => Set<PageView>();
    public DbSet<SmsLog> SmsLogs => Set<SmsLog>();
    public DbSet<BlockedSlot> BlockedSlots => Set<BlockedSlot>();
    public DbSet<GalleryItem> GalleryItems => Set<GalleryItem>();
    public DbSet<PromoBannerSettings> PromoBannerSettings => Set<PromoBannerSettings>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Service>(entity =>
        {
            entity.ToTable("services");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(200);
            entity.Property(e => e.Icon).HasColumnName("icon").HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnName("description").HasMaxLength(500);
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.SortOrder).HasColumnName("sort_order");
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.ToTable("appointments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FullName).HasColumnName("full_name").HasMaxLength(100);
            entity.Property(e => e.Phone).HasColumnName("phone").HasMaxLength(15);
            entity.Property(e => e.VehicleMake).HasColumnName("vehicle_make").HasMaxLength(100);
            entity.Property(e => e.VehicleModel).HasColumnName("vehicle_model").HasMaxLength(100);
            entity.Property(e => e.VehicleYear).HasColumnName("vehicle_year");
            entity.Property(e => e.LicensePlate).HasColumnName("license_plate").HasMaxLength(20);
            entity.Property(e => e.ServiceId).HasColumnName("service_id");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.TimeSlot).HasColumnName("time_slot").HasMaxLength(10);
            entity.Property(e => e.Note).HasColumnName("note").HasMaxLength(500);
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.KvkkConsent).HasColumnName("kvkk_consent");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.TrackingToken).HasColumnName("tracking_token").HasMaxLength(64);
            entity.Property(e => e.VehicleWorkStatus).HasColumnName("vehicle_work_status");
            entity.Property(e => e.EstimatedCompletionAt).HasColumnName("estimated_completion_at");
            entity.Property(e => e.TrackingNote).HasColumnName("tracking_note").HasMaxLength(500);
            entity.Property(e => e.VehicleReceivedAt).HasColumnName("vehicle_received_at");
            entity.Property(e => e.WorkStartedAt).HasColumnName("work_started_at");
            entity.Property(e => e.ReadyAt).HasColumnName("ready_at");
            entity.Property(e => e.DeliveredAt).HasColumnName("delivered_at");

            entity.HasIndex(e => new { e.Date, e.TimeSlot });
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Phone);
            entity.HasIndex(e => e.TrackingToken).IsUnique();

            entity.HasOne(e => e.Service)
                .WithMany(s => s.Appointments)
                .HasForeignKey(e => e.ServiceId);
        });

        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.ToTable("admin_users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Username).HasColumnName("username").HasMaxLength(100);
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.LastLoginAt).HasColumnName("last_login_at");
            entity.HasIndex(e => e.Username).IsUnique();
        });

        modelBuilder.Entity<PageView>(entity =>
        {
            entity.ToTable("page_views");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Path).HasColumnName("path").HasMaxLength(500);
            entity.Property(e => e.VisitorId).HasColumnName("visitor_id").HasMaxLength(50);
            entity.Property(e => e.IpHash).HasColumnName("ip_hash").HasMaxLength(64);
            entity.Property(e => e.UserAgent).HasColumnName("user_agent").HasMaxLength(500);
            entity.Property(e => e.Referrer).HasColumnName("referrer").HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.VisitorId);
        });

        modelBuilder.Entity<SmsLog>(entity =>
        {
            entity.ToTable("sms_logs");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Recipients).HasColumnName("recipients");
            entity.Property(e => e.RecipientCount).HasColumnName("recipient_count");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.NetgsmJobId).HasColumnName("netgsm_job_id").HasMaxLength(50);
            entity.Property(e => e.ResultCode).HasColumnName("result_code").HasMaxLength(10);
            entity.Property(e => e.Success).HasColumnName("success");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<BlockedSlot>(entity =>
        {
            entity.ToTable("blocked_slots");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.TimeSlot).HasColumnName("time_slot").HasMaxLength(10);
            entity.Property(e => e.Reason).HasColumnName("reason").HasMaxLength(200);
            entity.HasIndex(e => new { e.Date, e.TimeSlot });
        });

        modelBuilder.Entity<GalleryItem>(entity =>
        {
            entity.ToTable("gallery_items");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(200);
            entity.Property(e => e.MediaType).HasColumnName("media_type");
            entity.Property(e => e.MediaUrl).HasColumnName("media_url").HasMaxLength(1000);
            entity.Property(e => e.StoredFileName).HasColumnName("stored_file_name").HasMaxLength(260);
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.SortOrder).HasColumnName("sort_order");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(e => new { e.IsActive, e.SortOrder });
        });

        modelBuilder.Entity<PromoBannerSettings>(entity =>
        {
            entity.ToTable("promo_banner_settings");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedNever();
            entity.Property(e => e.IsEnabled).HasColumnName("is_enabled");
            entity.Property(e => e.MessageText).HasColumnName("message_text").HasMaxLength(500);
            entity.Property(e => e.CtaText).HasColumnName("cta_text").HasMaxLength(100);
            entity.Property(e => e.CtaLink).HasColumnName("cta_link").HasMaxLength(500);
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });
    }
}
