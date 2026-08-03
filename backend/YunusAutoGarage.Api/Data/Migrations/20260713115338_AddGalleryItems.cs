using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace YunusAutoGarage.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddGalleryItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "gallery_items",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    media_type = table.Column<int>(type: "integer", nullable: false),
                    media_url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    stored_file_name = table.Column<string>(type: "character varying(260)", maxLength: 260, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_gallery_items", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_gallery_items_is_active_sort_order",
                table: "gallery_items",
                columns: new[] { "is_active", "sort_order" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "gallery_items");
        }
    }
}
