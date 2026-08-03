using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YunusAutoGarage.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddVehicleYear : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "vehicle_year",
                table: "appointments",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "vehicle_year",
                table: "appointments");
        }
    }
}
