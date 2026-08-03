using YunusAutoGarage.Api.Dtos;

namespace YunusAutoGarage.Api.Services;

public class VehicleLookupService
{
    public Task<IReadOnlyList<VehicleCategoryDto>> GetCategoriesAsync(CancellationToken ct) =>
        Task.FromResult(TurkishVehicleCatalog.GetCategories());

    public Task<IReadOnlyList<VehicleMakeDto>> GetMakesAsync(string categoryId, CancellationToken ct) =>
        Task.FromResult(TurkishVehicleCatalog.GetMakes(categoryId));

    public Task<IReadOnlyList<VehicleModelDto>> GetModelsForMakeAsync(int makeId, CancellationToken ct) =>
        Task.FromResult(TurkishVehicleCatalog.GetModels(makeId));
}
