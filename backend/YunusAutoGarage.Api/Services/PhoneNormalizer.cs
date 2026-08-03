using System.Text.RegularExpressions;

namespace YunusAutoGarage.Api.Services;

public static class PhoneNormalizer
{
    private static readonly Regex TurkishGsmRegex = new(@"^0?5\d{9}$", RegexOptions.Compiled);

    public static bool IsValid(string phone) => TurkishGsmRegex.IsMatch(phone.Trim());

    public static string Normalize(string phone)
    {
        var digits = phone.Trim().TrimStart('0');
        if (digits.StartsWith("90") && digits.Length == 12)
        {
            digits = digits[2..];
        }

        return digits;
    }
}
