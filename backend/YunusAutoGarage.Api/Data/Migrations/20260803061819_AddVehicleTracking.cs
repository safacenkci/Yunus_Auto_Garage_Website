using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YunusAutoGarage.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddVehicleTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "delivered_at",
                table: "appointments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "estimated_completion_at",
                table: "appointments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ready_at",
                table: "appointments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tracking_note",
                table: "appointments",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tracking_token",
                table: "appointments",
                type: "character varying(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "vehicle_received_at",
                table: "appointments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "vehicle_work_status",
                table: "appointments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "work_started_at",
                table: "appointments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE appointments
                SET tracking_token = replace(gen_random_uuid()::text, '-', '')
                WHERE tracking_token = '' OR tracking_token IS NULL;
                """);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_tracking_token",
                table: "appointments",
                column: "tracking_token",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_appointments_tracking_token",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "delivered_at",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "estimated_completion_at",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "ready_at",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "tracking_note",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "tracking_token",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "vehicle_received_at",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "vehicle_work_status",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "work_started_at",
                table: "appointments");
        }
    }
}
