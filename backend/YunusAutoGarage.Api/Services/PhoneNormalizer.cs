namespace YunusAutoGarage.Api.Services;

public static class PhoneNormalizer
{
    private const int MinDigits = 8;
    private const int MaxDigits = 15;

    public static bool IsValid(string phone)
    {
        var digits = ExtractDigits(phone);
        return digits.Length is >= MinDigits and <= MaxDigits;
    }

    public static string Normalize(string phone)
    {
        var digits = ExtractDigits(phone);

        // Türkiye yerel mobil: 05XXXXXXXXX
        if (digits.Length == 11 && digits.StartsWith("05"))
        {
            return "90" + digits[1..];
        }

        // Türkiye yerel mobil (başında 0 yok): 5XXXXXXXXX
        if (digits.Length == 10 && digits[0] == '5')
        {
            return "90" + digits;
        }

        return digits;
    }

    public static string ExtractDigits(string phone) =>
        new string(phone.Where(char.IsDigit).ToArray());
}
