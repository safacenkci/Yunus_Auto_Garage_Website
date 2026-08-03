using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YunusAutoGarage.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPromoBannerSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "promo_banner_settings",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false),
                    is_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    message_text = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    cta_text = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    cta_link = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_promo_banner_settings", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "promo_banner_settings");
        }
    }
}
