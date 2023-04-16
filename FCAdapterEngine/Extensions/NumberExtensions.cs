namespace FCHttpRequestEngine.Extensions
{
    public static class NumberExtensions
    {
        public static (bool, int) ParseInteger(this string input)
        {
            int result;
            var success = int.TryParse(input, out result);
            return (success, result);
        }
        public static (bool, decimal) ParseDecimal(this string input)
        {
            decimal result = -1;
            var success = decimal.TryParse(input, out result);
            return (success, result);
        }

    }
}
