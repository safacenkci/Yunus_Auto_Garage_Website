using System.Globalization;
using YunusAutoGarage.Api.Dtos;

namespace YunusAutoGarage.Api.Services;

public static class TurkishVehicleCatalog
{
    private const string DefaultCategory = "otomobil";
    private static readonly string[] SimpleModel = ["Diğer"];

    private static readonly VehicleCategory[] Categories =
    [
        new("otomobil", "Otomobil"),
        new("motosiklet", "Motosiklet"),
        new("suv-pickup", "Arazi, SUV & Pickup"),
        new("minivan-panelvan", "Minivan & Panelvan"),
        new("karavan", "Karavan"),
        new("atv", "ATV"),
        new("elektrikli", "Elektrikli Araç"),
        new("klasik", "Klasik Araç"),
        new("utv", "UTV"),
    ];

    private static readonly VehicleBrand[] OtomobilBrands =
    [
        new(1, "otomobil", "Abarth", ["500e"]),
        new(2, "otomobil", "Alfa Romeo", ["Giulia", "Giulia Quadrifoglio", "Giulietta", "145", "146", "147", "155", "156", "159", "166", "33", "4C", "75"]),
        new(3, "otomobil", "Arora", ["S1"]),
        new(4, "otomobil", "BYD", ["Dolphin", "Han", "Seal"]),
        new(5, "otomobil", "Chevrolet", ["Aveo", "Camaro", "Caprice", "Cavalier", "Celebrity", "Corvette", "Cruze", "Epica", "Evanda", "Geo Storm", "Impala", "Kalos", "Lacetti"]),
        new(6, "otomobil", "Daewoo", ["Nexia", "Nubira", "Espero", "Lanos", "Leganza", "Matiz", "Racer", "Tico"]),
        new(7, "otomobil", "Ferrari", ["296", "360", "430", "458", "488", "575", "599", "812", "849", "California", "12Cilindri", "F12", "F355"]),
        new(8, "otomobil", "Ford", ["B-Max", "C-Max", "Escort", "Fiesta", "Focus", "Fusion", "Galaxy", "Grand C-Max", "Ka", "Mondeo", "Mustang", "S-Max", "Taurus"]),
        new(9, "otomobil", "Geely", ["Echo", "Emgrand", "Familia", "FC"]),
        new(10, "otomobil", "Hyundai", ["Accent", "Accent Blue", "Accent Era", "Atos", "Centennial", "Coupe", "Elantra", "Excel", "Genesis", "Getz", "Grandeur", "i10", "i20"]),
        new(11, "otomobil", "Infiniti", ["Q30", "Q50", "Q60", "G", "I30", "M"]),
        new(12, "otomobil", "Jiayuan", ["Eidola"]),
        new(13, "otomobil", "Lamborghini", ["Aventador", "Gallardo", "Huracan", "Revuelto", "Temerario"]),
        new(14, "otomobil", "Lexus", ["CT", "ES", "GS", "IS", "LC", "LM", "LS", "RC"]),
        new(15, "otomobil", "Lotus", ["Elise", "Emira", "Elan", "Esprit"]),
        new(16, "otomobil", "Maserati", ["Cambiocorsa", "Ghibli", "GranCabrio", "GranCabrio E", "GranSport", "GranTurismo", "GranTurismo E", "MC20", "Spyder", "Quattroporte", "4 Serisi"]),
        new(17, "otomobil", "Mini", ["Cooper", "Cooper Clubman", "Cooper Electric", "John Cooper", "One", "Cooper S"]),
        new(18, "otomobil", "Ortimobil", ["Alexa", "Omobil"]),
        new(19, "otomobil", "Plymouth", ["Laser"]),
        new(20, "otomobil", "Porsche", ["718", "911", "Boxster", "Cayman", "Panamera", "Taycan Elektrik"]),
        new(21, "otomobil", "Regal Raptor", ["K3 KLS", "K4", "K5", "K5 Long", "K5 Pro"]),
        new(22, "otomobil", "RKS", ["A1", "D2", "M5", "R3"]),
        new(23, "otomobil", "Rover", ["25", "45", "75", "200", "214", "216", "414", "416", "420", "620", "820", "825"]),
        new(24, "otomobil", "Suzuki", ["Alto", "Baleno", "Splash", "Swift", "SX4", "Wagon R", "Ignis", "Liana", "Maruti"]),
        new(25, "otomobil", "Tesla", ["Model 3", "Model S", "Model X", "Model Y"]),
        new(26, "otomobil", "TOGG", ["T10F", "T10X"]),
        new(27, "otomobil", "Volkswagen", ["Arteon", "Beetle", "Bora", "EOS", "FOX", "Golf", "ID.3", "ID.7", "Jetta", "Lupo", "Passat", "Passat Alltrack", "Passat Variant"]),
        new(28, "otomobil", "Acura", ["ILX"]),
        new(29, "otomobil", "Alpine", ["A110", "A290"]),
        new(30, "otomobil", "Aston Martin", ["Cygnet", "DB11", "DB12", "DB7", "DB9", "DBS", "Rapide", "Vanquish", "Vantage"]),
        new(31, "otomobil", "Bentley", ["Continental", "Flying Spur", "Mulsanne"]),
        new(32, "otomobil", "Cadillac", ["CTS", "BLS", "Brougham", "DeVille", "Eldorado", "Fleetwood", "Seville", "STS"]),
        new(33, "otomobil", "Chrysler", ["300 C", "300 M", "Concorde", "Crossfire", "LHS", "Neon", "PT Cruiser", "Sebring", "Stratus"]),
        new(34, "otomobil", "Cupra", ["Born", "Leon"]),
        new(35, "otomobil", "Daihatsu", ["Cuore", "Materia", "Move", "Sirion", "Applause", "Charade", "Copen", "YRV"]),
        new(36, "otomobil", "DS Automobiles", ["DS 3", "DS 4", "DS 5", "DS 9", "No4"]),
        new(37, "otomobil", "Fiat", ["124 Spider", "Albea", "Brava", "Bravo", "126 Bis", "Coupe", "500 Ailesi", "Egea", "Idea", "Linea", "Marea", "Mirafiori", "Multipla"]),
        new(38, "otomobil", "I-GO", ["J4"]),
        new(39, "otomobil", "Kia", ["Capital", "Carens", "Carnival", "Ceed", "Cerato", "Clarus", "Magentis", "Opirus", "Optima", "Picanto", "Pride", "Pro Ceed", "Rio"]),
        new(40, "otomobil", "Kuba", ["Chok", "City", "M5"]),
        new(41, "otomobil", "Lancia", ["Delta", "Thema", "Y (Ypsilon)", "Kappa", "Phedra"]),
        new(42, "otomobil", "McLaren", ["720S", "Artura", "GT", "MP4-12C"]),
        new(43, "otomobil", "MG", ["F", "MG3", "MG4", "MG7", "ZR", "ZT"]),
        new(44, "otomobil", "Mitsubishi", ["Attrage", "Colt", "Galant", "Lancer", "Lancer Evolution", "3000GT", "Carisma", "Diamante", "Eclipse", "Grandis", "Sigma", "Space Star", "Space Wagon"]),
        new(45, "otomobil", "Motolux", ["WOW 01"]),
        new(46, "otomobil", "Nissan", ["200 SX", "300 ZX", "350 Z", "Almera", "Altima", "Bluebird", "GT-R", "Laurel Altima", "Maxima", "Micra", "Note", "NX Coupe", "Primera"]),
        new(47, "otomobil", "Opel", ["Adam", "Agila", "Ascona", "Astra", "Astra-e", "Calibra", "Cascada", "Corsa", "Corsa-e", "GT (Roadster)", "Insignia", "Kadett", "Manta"]),
        new(48, "otomobil", "Polestar", ["Polestar 2 Long Range"]),
        new(49, "otomobil", "Proton", ["Gen-2", "Savvy", "Waja", "218", "315", "415", "416", "418", "420", "Persona"]),
        new(50, "otomobil", "Relive", ["Baw1", "EZI", "N1"]),
        new(51, "otomobil", "Roewe", ["MG 550"]),
        new(52, "otomobil", "Saab", ["9-3", "9-5", "900", "9000"]),
        new(53, "otomobil", "Seat", ["Alhambra", "Altea", "Arosa", "Cordoba", "Exeo", "Ibiza", "Leon", "Marbella", "Toledo"]),
        new(54, "otomobil", "Smart", ["Fortwo", "Forfour", "Roadster"]),
        new(55, "otomobil", "Tata", ["Indica", "Indigo", "Marina", "Vista", "Manza"]),
        new(56, "otomobil", "The London Taxi", ["TX4"]),
        new(57, "otomobil", "Toyota", ["Auris", "Avensis", "Camry", "Carina", "Celica", "Corolla", "Corona", "Cressida", "GT86", "MR2", "Prius", "Starlet", "Supra"]),
        new(58, "otomobil", "Volta", ["EV1", "EV2", "V1"]),
        new(59, "otomobil", "Zlin Motors", ["Spark", "Spark-H"]),
        new(60, "otomobil", "Aion", ["S"]),
        new(61, "otomobil", "Anadol", ["A"]),
        new(62, "otomobil", "Audi", ["A1", "A2", "A3", "A4", "A5", "A6", "A6 E-Tron", "A7", "A8", "E-Tron GT", "R8", "RS", "S Serisi"]),
        new(63, "otomobil", "BMW", ["1 Serisi", "2 Serisi", "3 Serisi", "4 Serisi", "5 Serisi", "6 Serisi", "7 Serisi", "8 Serisi", "i Serisi", "M Serisi", "Z Serisi"]),
        new(64, "otomobil", "Buick", ["Le Sabre", "Regal", "Riviera", "Roadmaster"]),
        new(65, "otomobil", "Chery", ["Alia", "Chance", "Kimo", "Niche"]),
        new(66, "otomobil", "Citroen", ["AMI", "C-Elysée", "C1", "C2", "C3", "e-C3", "C3 Picasso", "C4", "C4 Grand Picasso", "C4 Picasso", "C4 X", "e-C4", "e-C4 X"]),
        new(67, "otomobil", "Dacia", ["Jogger", "Lodgy", "Logan", "Sandero", "Solenza"]),
        new(68, "otomobil", "Dodge", ["Avenger", "Challenger", "Viper", "Charger", "Magnum"]),
        new(69, "otomobil", "Eagle", ["Talon"]),
        new(70, "otomobil", "Honda", ["Accord", "City", "Civic", "CR-Z", "CRX", "E", "FR-V", "Integra", "Jazz", "Legend", "Logo", "Prelude", "S2000"]),
        new(71, "otomobil", "Ikco", ["Samand"]),
        new(72, "otomobil", "Jaguar", ["Daimler", "F-Type", "S-Type", "Sovereign", "X-Type", "XE", "XF", "XJ", "XJ6", "XJR", "XJS", "XK8", "XKR"]),
        new(73, "otomobil", "Joyce", ["One"]),
        new(74, "otomobil", "Lada", ["Kalina", "Nova", "Priora", "Samara", "VAZ", "Vega"]),
        new(75, "otomobil", "Leapmotor", ["T03"]),
        new(76, "otomobil", "Lincoln", ["Mark", "Town Car"]),
        new(77, "otomobil", "Marcos", ["Mantis"]),
        new(78, "otomobil", "Mazda", ["2", "3", "5", "6", "MPV", "MX", "Premacy", "121", "323", "626", "929", "Lantis", "RX"]),
        new(79, "otomobil", "Mercedes-Benz", ["A Serisi", "AMG GT", "B Serisi", "C Serisi", "CL", "CLA", "CLE", "CLC", "CLK", "CLS", "E Serisi", "EQE", "EQS"]),
        new(80, "otomobil", "Micro", ["Microlino"]),
        new(81, "otomobil", "Morgan", ["Plus Four", "Supersport"]),
        new(82, "otomobil", "Nieve", ["Evzoom", "Q-EN"]),
        new(83, "otomobil", "Peugeot", ["106", "107", "205", "206", "206 +", "207", "208", "e-208", "301", "305", "306", "307", "308"]),
        new(84, "otomobil", "Pontiac", ["Firebird", "Grand Am", "Solstice", "Sunbird"]),
        new(85, "otomobil", "Rainwoll", ["RW 10"]),
        new(86, "otomobil", "Reeder", ["Reev Fancy"]),
        new(87, "otomobil", "Renault", ["Clio", "Espace", "Fluence", "Fluence Z.E.", "Grand Scenic", "Grand Modüs", "Laguna", "Latitude", "Megane", "Megane E-Tech", "Modus", "Safrane", "Scenic"]),
        new(88, "otomobil", "Rolls-Royce", ["Ghost", "Phantom", "Wraith", "Spectre"]),
        new(89, "otomobil", "Saipa", ["Saba"]),
        new(90, "otomobil", "Skoda", ["Citigo", "Fabia", "Favorit", "Felicia", "Forman", "Octavia", "Rapid", "Roomster", "Scala", "Superb"]),
        new(91, "otomobil", "Subaru", ["BRZ", "Impreza", "Legacy", "Levorg", "Justy", "Leone", "Vivio"]),
        new(92, "otomobil", "Tofaş", ["Doğan", "Kartal", "Murat", "Şahin", "Serçe"]),
        new(93, "otomobil", "Vanderhall", ["Carmel GTS", "Venice GT", "Venice GTS"]),
        new(94, "otomobil", "Volvo", ["C30", "C70", "S40", "S60", "S70", "S80", "S90", "V40", "V40 Cross Country", "V50", "V60", "V60 Cross Country", "V70"]),
        new(95, "otomobil", "XEV", ["Yoyo"]),
        new(96, "otomobil", "Yuki", ["Amy", "Hector Pro"]),
    ];

    private static readonly VehicleBrand[] OtherBrands =
    [
        ..SimpleBrands("motosiklet", 10001,
            "Honda", "Yamaha", "Kawasaki", "Suzuki", "BMW", "Ducati", "KTM", "Bajaj", "Aprilia", "Arora",
            "RKS", "Kuba", "Mondial", "CF Moto", "Benelli", "Piaggio", "Vespa", "Diğer"),
        ..SimpleBrands("suv-pickup", 20001,
            "Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Toyota", "Ford", "Renault", "Hyundai", "Kia", "Nissan",
            "Jeep", "Land Rover", "Dacia", "Skoda", "Cupra", "Chery", "BYD", "Tesla", "TOGG", "Peugeot", "Citroen",
            "Opel", "Fiat", "Mitsubishi", "Subaru", "Mazda", "Volvo", "Honda", "Porsche", "Diğer"),
        ..SimpleBrands("minivan-panelvan", 30001,
            "Citroen", "Ford", "Renault", "Peugeot", "Volkswagen", "Fiat", "Opel", "Mercedes-Benz", "Dacia",
            "Toyota", "Hyundai", "Kia", "Diğer"),
        ..SimpleBrands("karavan", 40001, "Motokaravan", "Çekme Karavan", "Diğer"),
        ..SimpleBrands("atv", 50001,
            "CF Moto", "Can-Am", "Polaris", "Arora", "Apachi", "Aodes", "Segway", "Kuba", "Access", "Diğer"),
        ..SimpleBrands("elektrikli", 60001,
            "Tesla", "TOGG", "BYD", "Renault", "Volkswagen", "BMW", "Mercedes-Benz", "Hyundai", "Kia", "MG",
            "Peugeot", "Citroen", "Opel", "Fiat", "Volta", "Diğer"),
        ..SimpleBrands("klasik", 70001, "Klasik Otomobil", "Klasik Motosiklet", "Klasik Arazi Aracı", "Diğer"),
        ..SimpleBrands("utv", 80001, "Can-Am", "CF Moto", "Polaris", "Segway", "Buggy", "Diğer"),
    ];

    private static readonly VehicleBrand[] AllBrands = [..OtomobilBrands, ..OtherBrands];

    private static readonly Dictionary<int, VehicleBrand> BrandsById =
        AllBrands.ToDictionary(b => b.Id);

    private static readonly Dictionary<string, string> CategoryNames =
        Categories.ToDictionary(c => c.Id, c => c.Name);

    public static IReadOnlyList<VehicleCategoryDto> GetCategories() =>
        Categories.Select(c => new VehicleCategoryDto(c.Id, c.Name)).ToList();

    public static IReadOnlyList<VehicleMakeDto> GetMakes(string categoryId)
    {
        var category = string.IsNullOrWhiteSpace(categoryId) ? DefaultCategory : categoryId.Trim().ToLowerInvariant();
        return AllBrands
            .Where(b => b.CategoryId == category)
            .Select(b => new VehicleMakeDto(b.Id, b.Name))
            .OrderBy(b => b.Name, StringComparer.Create(new CultureInfo("tr-TR"), ignoreCase: true))
            .ToList();
    }

    public static IReadOnlyList<VehicleModelDto> GetModels(int makeId)
    {
        if (!BrandsById.TryGetValue(makeId, out var brand))
        {
            return [];
        }

        return brand.Models
            .Select((name, index) => new VehicleModelDto(makeId * 1000 + index + 1, name))
            .ToList();
    }

    public static string? GetCategoryName(string categoryId) =>
        CategoryNames.TryGetValue(categoryId, out var name) ? name : null;

    private static IEnumerable<VehicleBrand> SimpleBrands(string categoryId, int idOffset, params string[] names) =>
        names.Select((name, index) => new VehicleBrand(idOffset + index, categoryId, name, SimpleModel));

    private sealed record VehicleCategory(string Id, string Name);

    private sealed record VehicleBrand(int Id, string CategoryId, string Name, string[] Models);
}
